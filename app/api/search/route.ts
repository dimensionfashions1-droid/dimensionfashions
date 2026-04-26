import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.max(1, Number(searchParams.get('limit')) || 6)

    if (!query) {
      return NextResponse.json({ data: [] })
    }

    const supabase = await createClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    // 1. Search Categories (Limited to first page or small count)
    let categories: any[] = []
    if (page === 1) {
        const { data: catData } = await supabase
            .from('categories')
            .select('id, name, slug, image_url')
            .ilike('name', `%${query}%`)
            .limit(3)
        categories = (catData || []).map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.image_url || null,
            type: 'category'
        }))
    }

    // 2. Search Products with Pagination
    const { data: rawProducts, error, count } = await supabase
      .from('products')
      .select('id, title, slug, images, price', { count: 'exact' })
      .eq('status', 'published')
      .ilike('title', `%${query}%`)
      .range(from, to)

    if (error) throw error

    const products = (rawProducts || []).map((p) => ({
      id: p.id,
      name: p.title,
      slug: p.slug,
      image: p.images?.[0] || null,
      price: p.price,
      type: 'product'
    }))

    const results = page === 1 ? [...categories, ...products] : products

    return NextResponse.json({ 
        data: results,
        meta: {
            total: (count || 0),
            page,
            limit,
            hasMore: (count || 0) > to
        }
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Search API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to search' }, { status: 500 })
  }
}
