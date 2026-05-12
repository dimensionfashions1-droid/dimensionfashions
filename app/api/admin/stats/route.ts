import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function GET() {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createClient()

    // Aggregate Orders & Revenue
    // Revenue: only paid and not cancelled
    const { data: revenueOrders, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')
      .neq('order_status', 'cancelled')

    if (revenueError) throw revenueError

    const totalRevenue = revenueOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)

    // Confirmed Orders: not cancelled
    const { count: totalOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .neq('order_status', 'cancelled')

    if (ordersError) throw ordersError

    // Aggregate Out of Stock products
    const { count: outOfStock, error: stockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_in_stock', false)

    if (stockError) throw stockError

    // Aggregate Users (Customers) - excluding admins
    const { count: totalCustomers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false)

    if (usersError) throw usersError

    return NextResponse.json({
      data: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        outOfStock: outOfStock || 0,
        totalCustomers: totalCustomers || 0,
      }
    })

  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/stats error:', err)
    return NextResponse.json({ error: err.message || 'Failed to aggregate platform stats' }, { status: 500 })
  }
}
