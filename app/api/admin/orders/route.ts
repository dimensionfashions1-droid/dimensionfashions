import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function GET(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 15
    const search = searchParams.get('search')

    const supabase = await createClient()

    let query = supabase
      .from('orders')
      .select('*, order_items(id, title, quantity, price_at_purchase, image)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('order_status', status)
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: orders, error, count } = await query

    if (error) throw error

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: orders,
      meta: { total, page, totalPages }
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/orders GET error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 })
  }
}
