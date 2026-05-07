import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'

// Order Number Generator
const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const payload = await request.json()
    const { cartItems, address, subtotal } = payload

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // 1. STOCK VALIDATION (Variant Aware)
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminSupabase = await createAdminClient()

    // 1.1 Fetch Settings for Recalculation
    const { data: settingsData } = await adminSupabase
      .from('site_settings')
      .select('key, value')
    
    const settings = (settingsData || []).reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

    const flatRate = Number(settings.flat_shipping_rate || 0)
    const threshold = Number(settings.free_shipping_threshold || 0)

    const recalculatedShipping = subtotal >= threshold && threshold > 0 ? 0 : flatRate
    const recalculatedTotal = subtotal + recalculatedShipping
    
    const finalShippingCost = recalculatedShipping
    const finalTotalAmount = recalculatedTotal

    for (const item of cartItems) {
      const { data: p, error: pError } = await adminSupabase
          .from('products')
          .select(`
              id, title, stock_count,
              product_variants (
                  id, stock_count, is_active,
                  product_variant_options (
                      attribute_definitions (slug),
                      attribute_options (value)
                  )
              )
          `)
          .eq('id', item.productId)
          .single()

      if (pError || !p) {
        return NextResponse.json({ error: `Product ${item.title} not found` }, { status: 404 })
      }

      let availableStock = p.stock_count

      if (item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0) {
        const variant = p.product_variants.find((v: any) => {
            if (!v.is_active) return false
            const vOptions = v.product_variant_options || []
            if (vOptions.length === 0) return false

            const vAttrSlugs = Array.from(new Set(vOptions.map((o: any) => o.attribute_definitions?.slug)))
            return vAttrSlugs.every(slug => {
                const s = slug as string
                const userVal = String(item.selectedAttributes[s] || '').toLowerCase().trim()
                const opt = vOptions.find((o: any) => o.attribute_definitions?.slug === s)
                const variantVal = String(opt?.attribute_options?.value || '').toLowerCase().trim()
                return userVal === variantVal && userVal !== ''
            })
        })

        if (variant) {
            availableStock = variant.stock_count
        } else {
            return NextResponse.json({ error: `Selected variant for ${item.title} is no longer available.` }, { status: 400 })
        }
      }

      if (availableStock < item.quantity) {
        return NextResponse.json({ 
            error: `Insufficient stock for ${item.title}. Only ${availableStock} left.`,
            outOfStock: true 
        }, { status: 400 })
      }
    }

    // 2. CREATE RAZORPAY ORDER (Always online now)
    const orderNumber = generateOrderNumber()
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalTotalAmount * 100),
      currency: 'INR',
      receipt: orderNumber,
    })

    // 3. PERSIST ORDER TO DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        order_number: razorpayOrder.receipt,
        email: user?.email || address.email || "guest@example.com",
        phone: address.phone,
        first_name: address.first_name,
        last_name: address.last_name,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        subtotal: subtotal,
        shipping_cost: finalShippingCost,
        total_amount: finalTotalAmount,
        payment_method: 'upi', // Fixed to upi/online
        payment_status: 'pending',
        order_status: 'processing',
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 4. INSERT ORDER ITEMS
    const orderItemsRows = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      price_at_purchase: item.price,
      selected_attributes: item.selectedAttributes
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsRows)

    if (itemsError) throw itemsError

    return NextResponse.json({ 
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        dbOrderId: order.id,
        orderNumber: order.order_number
    })

  } catch (error: any) {
    console.error('Order Creation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
