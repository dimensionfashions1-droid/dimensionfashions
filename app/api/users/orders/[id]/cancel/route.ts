import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15 route handlers, params is a Promise
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const orderId = resolvedParams.id

  const body = await request.json().catch(() => ({}))
  const reason = body.reason?.trim()

  if (!reason) {
    return NextResponse.json({ error: 'A cancellation reason is required.' }, { status: 400 })
  }

  // Look up the order to make sure they own it and it's eligible to be cancelled
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('order_status')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Only allow if order is processing or pending
  if (order.order_status !== 'processing') {
    return NextResponse.json({ error: 'This order has progressed beyond the cancellation stage and cannot be cancelled automatically.' }, { status: 400 })
  }

  // Update table adding cancellation request
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      cancellation_requested: true,
      cancellation_reason: reason
    })
    .eq('id', orderId)
    .eq('user_id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Cancellation request submitted to admin' })
}
