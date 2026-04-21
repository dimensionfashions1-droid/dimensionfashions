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
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 8
    const sort = searchParams.get('sort') || 'featured'
    
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null
    
    // E.g., colors=Red,Gold&sizes=S,M
    const colors = searchParams.get('colors')?.split(',').filter(Boolean)
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean)

    const supabase = await createClient()

    if (category) {
      // First find the category ID if slug is provided
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (catData) {
        // Use the ID directly in the products query
        // This is safer than inner join slug when we want left join behavior for non-filtered queries
      }
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(slug),
        product_attributes(
          attribute_definitions(slug),
          attribute_options(value)
        )
      `)

    if (category) {
       // Re-fetch to get ID or just filter by joined slug (which requires inner join logic for that specific filter)
       // Let's actually just use the eq on 'categories.slug' but without !inner in the main select
       query = query.eq('categories.slug', category)
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

    // Apply Supabase sorting natively
    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true })
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else {
      query = query.order('is_featured', { ascending: false, nullsFirst: false })
    }

    const { data: rawProducts, error } = await query

    if (error) throw error
    
    const products = rawProducts as unknown as FetchedProduct[]

    // Post-filter logic for complex M:N relationships
    let filtered = products

    if (colors && colors.length > 0) {
      filtered = filtered.filter((p) => {
        return p.product_attributes?.some((pa) => 
          pa.attribute_definitions?.slug === 'color' && 
          pa.attribute_options?.value &&
          colors.includes(pa.attribute_options.value)
        )
      })
    }

    if (sizes && sizes.length > 0) {
      filtered = filtered.filter((p) => {
        return p.product_attributes?.some((pa) => 
          pa.attribute_definitions?.slug === 'size' && 
          pa.attribute_options?.value &&
          sizes.includes(pa.attribute_options.value)
        )
      })
    }

    // Compute aggregations for the UI BEFORE pagination
    const availableColors = new Set<string>()
    const availableSizes = new Set<string>()
    let absoluteMinPrice = Number.MAX_VALUE
    let absoluteMaxPrice = 0

    filtered.forEach(p => {
      if (p.price < absoluteMinPrice) absoluteMinPrice = p.price
      if (p.price > absoluteMaxPrice) absoluteMaxPrice = p.price

      p.product_attributes?.forEach(pa => {
        const type = pa.attribute_definitions?.slug
        const val = pa.attribute_options?.value
        if (type === 'color' && val) availableColors.add(val)
        if (type === 'size' && val) availableSizes.add(val)
      })
    })

    if (absoluteMinPrice === Number.MAX_VALUE) absoluteMinPrice = 0

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    
    // Apply server-side pagination
    const paginatedSlice = filtered.slice((page - 1) * limit, page * limit)

    // Clean up response: remove heavy joined tables for the list view
    const cleanData = paginatedSlice.map((p) => {
        // Destructure to remove product_attributes and categories from the response
        const { product_attributes, categories, ...rest } = p
        
        // Handle case where categories might be null or an object (due to left join)
        const categorySlug = Array.isArray(categories) 
          ? categories[0]?.slug 
          : (categories as any)?.slug || 'uncategorized'

        return { 
          ...rest, 
          category: categorySlug,
          // Extract an array of colors and sizes strictly for the frontend pill/filter display
          colors: product_attributes
            ?.filter((pa) => pa.attribute_definitions?.slug === 'color' && pa.attribute_options?.value)
            .map((pa) => pa.attribute_options!.value) || [],
          sizes: product_attributes
            ?.filter((pa) => pa.attribute_definitions?.slug === 'size' && pa.attribute_options?.value)
            .map((pa) => pa.attribute_options!.value) || [],
        }
    })

    return NextResponse.json({ 
      data: cleanData,
      meta: {
        total,
        page,
        totalPages,
        minPrice: absoluteMinPrice,
        maxPrice: absoluteMaxPrice,
        filters: {
          colors: Array.from(availableColors),
          sizes: Array.from(availableSizes)
        }
      }
    })

  } catch (error: unknown) {
    console.error('API /products GET error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch' }, { status: 500 })
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
      for (const variant of variants) {
        const { price, original_price, stock_count, sku, images, options } = variant
        
        const { data: createdVariant, error: variantError } = await supabase
          .from('product_variants')
          .insert([{
            product_id: productId,
            price: price || null,
            original_price: original_price || null,
            stock_count: stock_count || 0,
            sku: sku || null,
            images: images || null
          }])
          .select()
          .single()

        if (variantError) throw variantError

        if (options && Array.isArray(options) && options.length > 0) {
          const optionRows = options.map((opt: any) => ({
            variant_id: createdVariant.id,
            attribute_id: opt.attribute_id,
            option_id: opt.option_id
          }))

          const { error: variantOptionsError } = await supabase
            .from('product_variant_options')
            .insert(optionRows)

          if (variantOptionsError) throw variantOptionsError
        }
      }
    }

    return NextResponse.json({ data: product, message: 'Product created successfully' })
  } catch (error: unknown) {
    console.error('API /products POST error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 })
  }
}
