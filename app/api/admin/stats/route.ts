import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function GET() {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createClient()

    // Aggregate Orders & Revenue
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, created_at')

    if (ordersError) throw ordersError

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)

    // Aggregate Out of Stock products
    const { count: outOfStock, error: stockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_in_stock', false)

    if (stockError) throw stockError

    // Aggregate Users (acting as proxies for ' subscribers' or strictly querying public.users)
    const { count: newSubscribers, error: subsError } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })

    if (subsError) throw subsError

    return NextResponse.json({
      data: {
        totalRevenue,
        totalOrders,
        outOfStock: outOfStock || 0,
        newSubscribers: newSubscribers || 0,
        recentActivity: orders.slice(0, 5) // Return some stubbed recent orders
      }
    })

  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/stats error:', err)
    return NextResponse.json({ error: err.message || 'Failed to aggregate platform stats' }, { status: 500 })
  }
}
