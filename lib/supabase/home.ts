import { createAdminClient } from './server'

export async function getHomeProducts(requestedCategorySlug?: string | null) {
    const supabase = await createAdminClient()

    // 1. Fetch exactly 5 categories
    const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(5)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })

    if (catError) throw catError

    const categories = categoriesData || []
    let products: any[] = []

    // 2. Identify target category
    let targetCategorySlug = requestedCategorySlug || null

    if (!targetCategorySlug && categories.length > 0) {
        // Find the first category that actually has products
        for (const cat of categories) {
            const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'published')
                .eq('category_id', cat.id)

            if (count && count > 0) {
                targetCategorySlug = cat.slug
                break
            }
        }

        // Fallback to the first category if all are empty
        if (!targetCategorySlug) {
            targetCategorySlug = categories[0].slug
        }
    }

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
                product_variants(id, stock_count, price, images, product_variant_options(attribute_definitions(slug), attribute_options(value, hex_code)))
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

                const totalStock = hasVariants 
                    ? variantsList.reduce((acc: number, v: any) => acc + (v.stock_count || 0), 0)
                    : (p.stock_count || 0)

                // Extract color options from variants
                const colorOptionsMap = new Map<string, any>()
                if (hasVariants) {
                    variantsList.forEach((v: any) => {
                        const colorOpt = v.product_variant_options?.find(
                            (pvo: any) => pvo.attribute_definitions?.slug === 'color'
                        )
                        if (colorOpt && colorOpt.attribute_options) {
                            const val = colorOpt.attribute_options.value
                            if (!colorOptionsMap.has(val)) {
                                colorOptionsMap.set(val, {
                                    name: val,
                                    hex: colorOpt.attribute_options.hex_code || val.toLowerCase(),
                                    image: v.images?.[0] || null,
                                    price: v.price || p.price,
                                    stockCount: v.stock_count || 0
                                })
                            } else {
                                const existing = colorOptionsMap.get(val)
                                existing.stockCount += (v.stock_count || 0)
                            }
                        }
                    })
                }

                const colorOptions = Array.from(colorOptionsMap.values())

                return {
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    originalPrice: p.original_price,
                    slug: p.slug,
                    image: p.images?.[0] || 'https://www.sourcesplash.com/i/random?q=western-fashion&w=1200&h=1600',
                    category: p.categories?.slug || targetCategorySlug,
                    hasVariants: hasVariants,
                    inStock: totalStock > 0,
                    stockCount: totalStock,
                    colorOptions: colorOptions.length > 0 ? colorOptions : undefined
                }
            })
        }
    }

    return {
        categories,
        products
    }
}
