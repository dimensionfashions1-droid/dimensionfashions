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

    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Category updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /categories/[id] PUT error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createClient()
    const { id } = await params

    // Also delete associated subcategories (FK CASCADE should handle this, but explicit is safer)
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /categories/[id] DELETE error:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 })
  }
}
