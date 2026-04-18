import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Only allow updating specific fields
    const allowedFields: Record<string, unknown> = {}
    const permitted = ['order_status', 'payment_status', 'tracking_number', 'courier_name', 'notes']

    for (const key of permitted) {
      if (key in body) {
        allowedFields[key] = body[key]
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Order updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/orders/[id] PUT error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 })
  }
}
