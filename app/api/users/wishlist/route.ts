import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ data: [] })
        }

        const { data, error } = await supabase
            .from('wishlist')
            .select(`
                id,
                product_id,
                products (
                    id,
                    title,
                    price,
                    original_price,
                    slug,
                    images,
                    stock_count
                )
            `)
            .eq('user_id', user.id)

        if (error) throw error

        const wishlistItems = (data || []).map((item: any) => ({
            id: item.products.id, // Frontend uses product.id for wishlist items
            title: item.products.title,
            price: item.products.price,
            image: item.products.images?.[0] || '',
            slug: item.products.slug,
            inStock: item.products.stock_count > 0
        }))

        return NextResponse.json({ data: wishlistItems })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { productId } = await request.json()

        const { error } = await supabase
            .from('wishlist')
            .upsert({
                user_id: user.id,
                product_id: productId
            }, { onConflict: 'user_id,product_id' })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (!productId) return NextResponse.json({ error: 'Missing Product ID' }, { status: 400 })

        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('product_id', productId)
            .eq('user_id', user.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
