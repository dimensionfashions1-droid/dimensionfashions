import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { productIds } = await request.json()

        if (!productIds || !Array.isArray(productIds)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const upsertRows = productIds.map(id => ({
            user_id: user.id,
            product_id: id
        }))

        const { error } = await supabase
            .from('wishlist')
            .upsert(upsertRows, { onConflict: 'user_id,product_id' })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
