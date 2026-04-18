import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function GET() {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, phone, is_admin, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data: users })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/users GET error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 })
  }
}
