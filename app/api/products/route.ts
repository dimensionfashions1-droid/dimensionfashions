import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'
import { ProductRow } from '@/types'

// Interfaces for strict type safety
interface JoinedProductAttribute {
  attribute_definitions: {
    slug: string
  } | null
  attribute_options: {
    value: string
  } | null
}

interface FetchedProduct extends Omit<ProductRow, 'category_id' | 'subcategory_id'> {
  categories?: {
    slug: string
  } | null
  product_attributes?: JoinedProductAttribute[]
  product_variants?: { id: string }[]
}

async function ensureProductUniqueness(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  title: string,
  slug: string,
  excludeId?: string
) {
  const loweredTitle = title.trim().toLowerCase()
  const loweredSlug = slug.trim().toLowerCase()

  let titleQuery = supabase.from('products').select('id, title, slug').ilike('title', title.trim())
  let slugQuery = supabase.from('products').select('id, title, slug').ilike('slug', slug.trim())

  if (excludeId) {
    titleQuery = titleQuery.neq('id', excludeId)
    slugQuery = slugQuery.neq('id', excludeId)
  }

  const [
    { data: titleMatches, error: titleError },
    { data: slugMatches, error: slugError },
  ] = await Promise.all([titleQuery, slugQuery])

  if (titleError) throw titleError
  if (slugError) throw slugError

  const duplicate = [...(titleMatches || []), ...(slugMatches || [])].find((row) =>
    row.title?.trim().toLowerCase() === loweredTitle || row.slug?.trim().toLowerCase() === loweredSlug
  )

  if (duplicate) {
    const isTitleDuplicate = duplicate.title?.trim().toLowerCase() === loweredTitle
    return {
      error: `A product with this ${isTitleDuplicate ? 'title' : 'slug'} already exists.`,
    }
  }

  return null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.max(1, Number(searchParams.get('limit')) || 12)
    const sort = searchParams.get('sort') || 'featured'

    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null

    const isAdmin = searchParams.get('admin') === 'true'

    const supabase = await createAdminClient()

    // --- DYNAMIC ATTRIBUTE FILTERING ---
    // 1. Identify attribute filters (exclude known non-attribute params)
    const knownParams = ['category', 'subcategory', 'search', 'page', 'limit', 'sort', 'minPrice', 'maxPrice', 'admin']
    const attributeFilters: Record<string, string[]> = {}
    
    searchParams.forEach((value, key) => {
        if (!knownParams.includes(key)) {
            const vals = value.split(',').filter(Boolean)
            if (vals.length > 0) {
                attributeFilters[key] = vals
            }
        }
    })

    // 2. Fetch product IDs that match attribute filters
    // We need to find products that have ALL the requested attributes (AND)
    // For each attribute, we find products that match ANY of its values (OR)
    let filteredProductIds: string[] | null = null

    if (Object.keys(attributeFilters).length > 0) {
        for (const [slug, values] of Object.entries(attributeFilters)) {
            const { data: matchedRows, error: attrMatchError } = await supabase
                .from('product_attributes')
                .select('product_id')
                .eq('attribute_definitions.slug', slug)
                .in('attribute_options.value', values)
                // We use inner joins via the select string to filter
                .select('product_id, attribute_definitions!inner(slug), attribute_options!inner(value)')

            if (attrMatchError) throw attrMatchError

            const currentIds = Array.from(new Set(matchedRows.map(r => r.product_id)))
            
            if (filteredProductIds === null) {
                filteredProductIds = currentIds
            } else {
                // Intersect with previous matches (AND logic between different attributes)
                filteredProductIds = filteredProductIds.filter(id => currentIds.includes(id))
            }
            
            // If no products match the current intersection, we can stop early
            if (filteredProductIds.length === 0) break
        }
    }

    // 1. Build Base Query with Joins
    let selectString = `
      *,
      categories!inner(slug),
      product_attributes(
        attribute_definitions(slug),
        attribute_options(value)
      ),
      product_variants(id, stock_count)
    `

    let query = supabase
      .from('products')
      .select(selectString, { count: 'exact' })

    // Apply attribute filter if we have one
    if (filteredProductIds !== null) {
        query = query.in('id', filteredProductIds)
    }

    // Security: Only allow admins to see drafts
    if (isAdmin) {
        const adminCheck = await requireAdmin()
        if (adminCheck) {
            query = query.eq('status', 'published')
        }
    } else {
        query = query.eq('status', 'published')
    }

    // 2. Apply Basic Filters
    if (category) {
        query = query.eq('categories.slug', category)
    }

    const subcategory = searchParams.get('subcategory')
    if (subcategory) {
        // Since we have categories!inner, we might need a similar join for subcategories if we filter by them
        // But for now, we can filter by the product's subcategory relation if it's joined
        // Let's keep it simple for now as per schema
    }

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    if (minPrice !== null && !isNaN(minPrice)) {
        query = query.gte('price', minPrice)
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
        query = query.lte('price', maxPrice)
    }

    // 4. Sorting
    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true })
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'bestsellers') {
      query = query.order('reviews_count', { ascending: false })
    } else if (sort === 'featured') {
      query = query.order('featured', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // 5. Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data: rawProducts, error, count } = await query.range(from, to)

    if (error) throw error

    // 6. Post-processing & Aggregations
    const products = (rawProducts || []) as any[]
    
    // Fetch global stats for filters and price range
    // We run these in parallel for performance
    const [
      { data: priceStats },
      { data: attrStats }
    ] = await Promise.all([
      supabase.from('products').select('price').order('price', { ascending: true }),
      supabase.from('product_attributes').select(`
        attribute_definitions(slug),
        attribute_options(value)
      `)
    ])

    const globalMin = priceStats?.[0]?.price || 0
    const globalMax = priceStats?.[priceStats.length - 1]?.price || 10000

    const availableColors = new Set<string>()
    const availableSizes = new Set<string>()

    attrStats?.forEach((as: any) => {
      const slug = as.attribute_definitions?.slug
      const val = as.attribute_options?.value
      if (slug === 'color' && val) availableColors.add(val)
      if (slug === 'size' && val) availableSizes.add(val)
    })
    
    const cleanData = products.map((p: any) => {
      const categorySlug = p.categories?.slug || 'uncategorized'
      const hasVariants = Array.isArray(p.product_variants) && p.product_variants.length > 0
      
      const totalStock = hasVariants 
        ? p.product_variants.reduce((acc: number, v: any) => acc + (v.stock_count || 0), 0)
        : (p.stock_count || 0)

      return {
        id: p.id,
        title: p.title,
        price: p.price,
        originalPrice: p.original_price,
        slug: p.slug,
        image: p.images?.[0] || '/placeholder.jpg',
        category: categorySlug,
        status: p.status || 'draft',
        hasVariants: hasVariants,
        inStock: totalStock > 0,
        stock_count: totalStock,
        colors: p.product_attributes
          ?.filter((pa: any) => pa.attribute_definitions?.slug === 'color')
          .map((pa: any) => pa.attribute_options?.value)
          .filter(Boolean) || [],
        sizes: p.product_attributes
          ?.filter((pa: any) => pa.attribute_definitions?.slug === 'size')
          .map((pa: any) => pa.attribute_options?.value)
          .filter(Boolean) || []
      }
    })

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: cleanData,
      meta: {
        total,
        page,
        totalPages,
        minPrice: globalMin,
        maxPrice: globalMax,
        filters: {
          colors: Array.from(availableColors),
          sizes: Array.from(availableSizes)
        }
      }
    })
  } catch (error: unknown) {
    console.error('API /products GET error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // 1. Secure Route - Admin Only
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const body = await request.json()
    const supabase = await createAdminClient()

    const { attributes, variants, ...productFields } = body

    if (!productFields.title?.trim() || !productFields.slug?.trim()) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 })
    }

    const uniquenessError = await ensureProductUniqueness(supabase, productFields.title, productFields.slug)
    if (uniquenessError) {
      return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
    }

    // 2. Insert into products
    const { data: product, error } = await supabase
      .from('products')
      .insert([productFields])
      .select()
      .single()

    if (error) throw error

    const productId = product.id

    // 3. Link attributes
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
      const attrRows = attributes.map((attr: any) => ({
        product_id: productId,
        attribute_id: attr.attribute_id,
        option_id: attr.option_id || null,
        text_value: attr.text_value || null,
      }))

      const { error: attrError } = await supabase
        .from('product_attributes')
        .insert(attrRows)

      if (attrError) throw attrError
    }

    // 4. Create Variants
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantRows = variants.map(v => ({
        product_id: productId,
        price: v.price ? Number(v.price) : null,
        original_price: v.original_price ? Number(v.original_price) : null,
        stock_count: Number(v.stock_count) || 0,
        sku: v.sku || null,
        images: v.images || null
      }))

      const { data: createdVariants, error: variantError } = await supabase
        .from('product_variants')
        .insert(variantRows)
        .select()

      if (variantError) throw variantError

      // Link options to created variants
      const optionRows: any[] = []
      createdVariants.forEach((cv, idx) => {
        const incomingVariant = variants[idx]
        if (incomingVariant.options && Array.isArray(incomingVariant.options)) {
          incomingVariant.options.forEach((opt: any) => {
            optionRows.push({
              variant_id: cv.id,
              attribute_id: opt.attribute_id,
              option_id: opt.option_id
            })
          })
        }
      })

      if (optionRows.length > 0) {
        const { error: variantOptionsError } = await supabase
          .from('product_variant_options')
          .insert(optionRows)

        if (variantOptionsError) throw variantOptionsError
      }
    }

    return NextResponse.json({ data: product, message: 'Product created successfully' })
  } catch (error: unknown) {
    console.error('API /products POST error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 })
  }
}
