import { NextResponse } from 'next/server'
import { getHomeProducts } from '@/lib/supabase/home'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const requestedCategory = searchParams.get('category')

        const { categories, products } = await getHomeProducts(requestedCategory)

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
