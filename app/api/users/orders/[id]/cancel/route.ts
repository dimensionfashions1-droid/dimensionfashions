import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/mail/mailer'
import { adminCancellationAlertTemplate } from '@/lib/mail/templates'

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
    .select('order_status, order_number, first_name, last_name, email, total_amount')
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
  // Use admin client since users don't have UPDATE RLS on orders table.
  // Ownership was already verified by the SELECT query above.
  const adminSupabase = await createAdminClient()

  const { error: updateError } = await adminSupabase
    .from('orders')
    .update({
      cancellation_requested: true,
      cancellation_reason: reason
    })
    .eq('id', orderId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Send cancellation alert email to admin
  try {
    const { data: settingsData } = await adminSupabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['store_email'])

    const settings = (settingsData || []).reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

    const adminEmail = settings.store_email || process.env.SMTP_USER
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `Cancellation Request - Order #${order.order_number}`,
        html: adminCancellationAlertTemplate({
          orderNumber: order.order_number,
          customerName: `${order.first_name} ${order.last_name}`,
          total: Number(order.total_amount).toLocaleString(),
          message: reason
        })
      })
    }
  } catch (e) {
    console.error('Cancellation Notification Error:', e)
  }

  return NextResponse.json({ success: true, message: 'Cancellation request submitted to admin' })
}
