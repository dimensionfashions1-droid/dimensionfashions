import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params
        const supabase = await createAdminClient()

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*)
            `)
            .eq('order_number', orderNumber)
            .single()

        if (error || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Return a sanitized version of the order for confirmation page
        return NextResponse.json({
            data: {
                order_number: order.order_number,
                created_at: order.created_at,
                total_amount: order.total_amount,
                first_name: order.first_name,
                last_name: order.last_name,
                email: order.email,
                address: order.address,
                city: order.city,
                state: order.state,
                pincode: order.pincode,
                order_status: order.order_status,
                items: order.order_items.map((item: any) => ({
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price_at_purchase,
                    image: item.image
                }))
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
