import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const adminError = await requireAdmin()
    if (adminError) return adminError

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const search = searchParams.get('search')

    const supabase = await createAdminClient()

    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ 
      data,
      meta: { total, page, totalPages, limit }
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch contact submissions' }, { status: 500 })
  }
}
