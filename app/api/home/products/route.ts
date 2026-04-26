import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const requestedCategory = searchParams.get('category')

        const supabase = await createAdminClient()

        // 1. Fetch exactly 5 categories
        const { data: categoriesData, error: catError } = await supabase
            .from('categories')
            .select('id, name, slug')
            .limit(5)
            .order('created_at', { ascending: true })

        if (catError) throw catError

        const categories = categoriesData || []
        let products: any[] = []

        // 2. Identify target category
        const targetCategorySlug = requestedCategory || (categories.length > 0 ? categories[0].slug : null)

        if (targetCategorySlug) {
            // 3. Fetch products using pure DB queries (Inner Join filter), limiting to 8 items
            const { data: rawProducts, error: prodError } = await supabase
                .from('products')
                .select(`
                    id, 
                    title, 
                    price, 
                    original_price,
                    slug, 
                    stock_count, 
                    is_in_stock,
                    images,
                    categories!inner(name,slug),
                    product_variants(id)
                `)
                .eq('status', 'published')
                .eq('categories.slug', targetCategorySlug)
                .order('created_at', { ascending: false })
                .limit(8)

            if (prodError) throw prodError

            if (rawProducts) {
                // Map to frontend-friendly fields
                products = rawProducts.map((p: any) => {
                    const variantsList = p.product_variants || []
                    const hasVariants = Array.isArray(variantsList) && variantsList.length > 0

                    return {
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        originalPrice: p.original_price,
                        slug: p.slug,
                        image: p.images?.[0] || 'https://www.sourcesplash.com/i/random?q=western-fashion&w=1200&h=1600',
                        category: p.categories?.slug || targetCategorySlug,
                        hasVariants: hasVariants,
                        inStock: p.is_in_stock
                    }
                })
            }
        }

        return NextResponse.json({
            data: {
                categories,
                products
            }
        })
    } catch (error: unknown) {
        console.error('API /home/products GET error:', error)
        const err = error as Error
        return NextResponse.json({ error: err.message || 'Failed to fetch home products' }, { status: 500 })
    }
}
