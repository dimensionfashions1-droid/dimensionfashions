import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function GET(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 15
    const search = searchParams.get('search')

    const supabase = await createAdminClient()

    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, is_admin, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: users, error, count } = await query

    if (error) throw error

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ 
      data: users,
      meta: { total, page, totalPages, limit }
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/users GET error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 })
  }
}
