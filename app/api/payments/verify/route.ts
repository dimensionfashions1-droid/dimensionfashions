import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId
    } = await request.json()

    // 1. VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 2. UPDATE ORDER STATUS
    // We use admin client to ensure we can update the order even if user is guest/RLS
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_method: 'upi',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
      })
      .eq('id', dbOrderId)
      .select('id, user_id')
      .single()

    if (orderError) throw orderError

    // 3. DEDUCT STOCK (Variant Aware)
    const { data: items, error: itemsError } = await adminSupabase
        .from('order_items')
        .select('product_id, quantity, selected_attributes')
        .eq('order_id', dbOrderId)

    if (itemsError) throw itemsError

    for (const item of (items || [])) {
        // Fetch product with variants
        const { data: p } = await adminSupabase
            .from('products')
            .select(`
                id, stock_count,
                product_variants (
                    id, stock_count, is_active,
                    product_variant_options (
                        attribute_definitions (slug),
                        attribute_options (value)
                    )
                )
            `)
            .eq('id', item.product_id)
            .single()
        
        if (!p) continue

        let variantToUpdate = null

        if (item.selected_attributes && Object.keys(item.selected_attributes).length > 0) {
            const selected = item.selected_attributes as Record<string, any>
            variantToUpdate = p.product_variants.find((v: any) => {
                if (!v.is_active) return false
                const vOptions = v.product_variant_options || []
                const vAttrSlugs = Array.from(new Set(vOptions.map((o: any) => o.attribute_definitions?.slug)))
                return vAttrSlugs.every(slug => {
                    const s = slug as string
                    const userVal = String(selected[s] || '').toLowerCase().trim()
                    const opt = vOptions.find((o: any) => o.attribute_definitions?.slug === s)
                    const variantVal = String(opt?.attribute_options?.value || '').toLowerCase().trim()
                    return userVal === variantVal && userVal !== ''
                })
            })
        }

        if (variantToUpdate) {
            await adminSupabase
                .from('product_variants')
                .update({ stock_count: Math.max(0, variantToUpdate.stock_count - item.quantity) })
                .eq('id', variantToUpdate.id)
        } else {
            await adminSupabase
                .from('products')
                .update({ stock_count: Math.max(0, p.stock_count - item.quantity) })
                .eq('id', item.product_id)
        }
    }

    // 4. CLEAR CART (If user is logged in)
    if (order.user_id) {
        await adminSupabase.from('cart').delete().eq('user_id', order.user_id)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Payment Verification Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
