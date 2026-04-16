import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ data: [] })
    }

    const supabase = await createClient()

    // Using basic ILIKE for search across title or description to support simple sub-string matching.
    const { data: rawProducts, error } = await supabase
      .from('products')
      .select('*, categories(slug)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10)

    if (error) throw error

    // Transform joined data to flat object expected by UI
    const products = rawProducts.map((p) => {
      const { categories, ...rest } = p
      return {
        ...rest,
        category: (categories as { slug: string } | null)?.slug
      }
    })

    return NextResponse.json({ data: products })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to search' }, { status: 500 })
  }
}
