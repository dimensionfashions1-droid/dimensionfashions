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

    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(slug),
        product_attributes(
          attribute_definitions!inner(slug),
          attribute_options!inner(value)
        )
      `)

    if (category) {
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
        
        return { 
          ...rest, 
          category: categories?.slug,
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

    if (!body.title?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 })
    }

    const uniquenessError = await ensureProductUniqueness(supabase, body.title, body.slug)
    if (uniquenessError) {
      return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
    }

    // 2. Insert into products
    const { data, error } = await supabase
      .from('products')
      .insert([body]) // Expecting validated body from admin frontend
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Product created successfully' })
  } catch (error: unknown) {
    console.error('API /products POST error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 })
  }
}
