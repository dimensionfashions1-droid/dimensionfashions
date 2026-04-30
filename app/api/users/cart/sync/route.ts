import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { items } = await request.json()

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items payload' }, { status: 400 })
        }

        for (const item of items) {
            const { productId, quantity, selectedAttributes } = item

            // Try to find existing
            const { data: existing } = await supabase
                .from('cart')
                .select('id, quantity')
                .eq('user_id', user.id)
                .eq('product_id', productId)
                .eq('selected_attributes', selectedAttributes)
                .single()

            if (existing) {
                // If exists, use the larger quantity or sum? 
                // Summing is usually safer for merging guest + existing
                await supabase
                    .from('cart')
                    .update({ quantity: existing.quantity + quantity })
                    .eq('id', existing.id)
            } else {
                await supabase
                    .from('cart')
                    .insert({
                        user_id: user.id,
                        product_id: productId,
                        quantity,
                        selected_attributes: selectedAttributes
                    })
            }
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
