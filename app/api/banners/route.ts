import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    const supabase = await createAdminClient()

    let query = supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })

    if (!all) {
      query = query.eq('is_active', true)
    }

    const { data: banners, error } = await query

    if (error) throw error

    return NextResponse.json({ data: banners })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('banners')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Banner created successfully' })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to create banner' }, { status: 500 })
  }
}
