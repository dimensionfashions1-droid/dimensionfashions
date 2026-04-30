import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const adminSupabase = await createAdminClient() // Use admin to ensure we get all relations if RLS is tight
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ data: [] })
        }

        // Fetch cart items
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', user.id)

        if (cartError) throw cartError
        if (!cartData || cartData.length === 0) return NextResponse.json({ data: [] })

        const cartItems = []

        for (const item of cartData) {
            const productId = item.product_id
            const selected = item.selected_attributes || {}

            // Fetch product with variants and options
            const { data: p, error: pError } = await adminSupabase
                .from('products')
                .select(`
                    id, title, price, slug, images, stock_count, is_in_stock,
                    product_variants (
                        id, price, stock_count, is_active,
                        product_variant_options (
                            attribute_definitions (slug),
                            attribute_options (value)
                        )
                    )
                `)
                .eq('id', productId)
                .single()

            if (pError || !p) continue

            let resolvedPrice = p.price
            let resolvedStock = p.stock_count
            let resolvedInStock = p.is_in_stock && p.stock_count > 0
            let resolvedImage = p.images?.[0] || ''

            // Match Variant logic
            if (p.product_variants && p.product_variants.length > 0) {
                const variant = p.product_variants.find((v: any) => {
                    if (!v.is_active) return false
                    const vOptions = v.product_variant_options || []
                    if (vOptions.length === 0) return false

                    // Get unique attributes for this variant
                    const vAttrSlugs = Array.from(new Set(vOptions.map((o: any) => o.attribute_definitions?.slug)))
                    
                    // Check if every attribute of this variant matches the user selection
                    return vAttrSlugs.every(slug => {
                        const userVal = String(selected[slug] || '').toLowerCase().trim()
                        const opt = vOptions.find((o: any) => o.attribute_definitions?.slug === slug)
                        const variantVal = String(opt?.attribute_options?.value || '').toLowerCase().trim()
                        return userVal === variantVal && userVal !== ''
                    })
                })

                if (variant) {
                    if (variant.price !== null && variant.price !== undefined) resolvedPrice = variant.price
                    resolvedStock = variant.stock_count
                    resolvedInStock = variant.stock_count > 0
                    if (variant.images?.[0]) resolvedImage = variant.images[0]
                }
            }

            cartItems.push({
                id: item.id,
                productId: productId,
                title: p.title,
                price: Number(resolvedPrice),
                image: resolvedImage,
                quantity: item.quantity,
                selectedAttributes: selected,
                slug: p.slug,
                stockCount: resolvedStock,
                inStock: resolvedInStock
            })
        }

        return NextResponse.json({ data: cartItems })
    } catch (error: any) {
        console.error('Cart GET Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { productId, quantity, selectedAttributes, action } = await request.json()

        const { data: existing } = await supabase
            .from('cart')
            .select('id, quantity')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .eq('selected_attributes', selectedAttributes)
            .maybeSingle()

        if (existing) {
            let newQuantity = existing.quantity + quantity
            if (action === 'set') newQuantity = quantity

            const { data: updated, error } = await supabase
                .from('cart')
                .update({ quantity: Math.max(1, newQuantity) })
                .eq('id', existing.id)
                .select('id')
                .single()
            
            if (error) throw error
            return NextResponse.json({ success: true, id: updated.id })
        } else {
            const { data: inserted, error } = await supabase
                .from('cart')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    quantity,
                    selected_attributes: selectedAttributes
                })
                .select('id')
                .single()
            
            if (error) throw error
            return NextResponse.json({ success: true, id: inserted.id })
        }
    } catch (error: any) {
        console.error('Cart POST Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
