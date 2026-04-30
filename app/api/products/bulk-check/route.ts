import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { items } = await request.json()
        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
        }

        const supabase = await createAdminClient()
        const productIds = items.map(i => i.productId)

        // Fetch products with their variants
        const { data: products, error } = await supabase
            .from('products')
            .select(`
                id,
                price,
                stock_count,
                is_in_stock,
                product_variants (
                    id,
                    price,
                    stock_count,
                    is_active,
                    product_variant_options (
                        attribute_definitions (slug),
                        attribute_options (value)
                    )
                )
            `)
            .in('id', productIds)

        if (error) throw error

        const results: Record<string, { price: number, stock_count: number, is_in_stock: boolean }> = {}

        items.forEach(item => {
            const p = products?.find(product => product.id === item.productId)
            if (!p) return

            const selected = item.selectedAttributes || {}
            
            // Find matching variant
            const variant = p.product_variants?.find((v: any) => {
                if (!v.is_active) return false
                const vOptions = v.product_variant_options || []
                
                // Get all variant attribute slugs for this product
                const variantAttrSlugs = Array.from(new Set(vOptions.map((o: any) => o.attribute_definitions?.slug)))
                
                // All variant attributes must be present in 'selected' and match
                return variantAttrSlugs.every(slug => {
                    const cartValue = selected[slug]
                    const variantOpt = vOptions.find((o: any) => o.attribute_definitions?.slug === slug)
                    return cartValue === variantOpt?.attribute_options?.value
                })
            })

            if (variant) {
                results[item.id] = {
                    price: Number(variant.price || p.price),
                    stock_count: variant.stock_count,
                    is_in_stock: variant.stock_count > 0
                }
            } else {
                results[item.id] = {
                    price: Number(p.price),
                    stock_count: p.stock_count,
                    is_in_stock: p.is_in_stock && p.stock_count > 0
                }
            }
        })

        return NextResponse.json({ data: results })
    } catch (error: any) {
        console.error('Bulk Check Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
