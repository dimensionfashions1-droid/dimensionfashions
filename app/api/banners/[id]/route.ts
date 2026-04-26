import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const body = await request.json()
    const { id } = await params

    const { data, error } = await supabase
      .from('banners')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Banner updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const { id } = await params

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Banner deleted successfully' })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to delete banner' }, { status: 500 })
  }
}
