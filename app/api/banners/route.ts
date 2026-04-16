import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get('placement')

    const supabase = await createClient()

    let query = supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (placement) {
      query = query.eq('placement', placement)
    }

    const { data: banners, error } = await query

    if (error) throw error

    return NextResponse.json({ data: banners })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch banners' }, { status: 500 })
  }
}
