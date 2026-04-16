import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
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

    // Clean up response: remove heavy joined tables for the list view
    const cleanData = filtered.map((p) => {
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

    return NextResponse.json({ data: cleanData })

  } catch (error: unknown) {
    console.error('API /products GET error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch' }, { status: 500 })
  }
}
