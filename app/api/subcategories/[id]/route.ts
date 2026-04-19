import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

async function ensureSubcategoryUniqueness(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  name: string,
  slug: string,
  excludeId: string
) {
  const loweredName = name.trim().toLowerCase()
  const loweredSlug = slug.trim().toLowerCase()

  const nameQuery = supabase
    .from('subcategories')
    .select('id, name, slug')
    .neq('id', excludeId)
    .ilike('name', name.trim())

  const slugQuery = supabase
    .from('subcategories')
    .select('id, name, slug')
    .neq('id', excludeId)
    .ilike('slug', slug.trim())

  const [
    { data: nameMatches, error: nameError },
    { data: slugMatches, error: slugError },
  ] = await Promise.all([nameQuery, slugQuery])

  if (nameError) throw nameError
  if (slugError) throw slugError

  const duplicate = [...(nameMatches || []), ...(slugMatches || [])].find((row) =>
    row.name?.trim().toLowerCase() === loweredName || row.slug?.trim().toLowerCase() === loweredSlug
  )

  if (duplicate) {
    const isNameDuplicate = duplicate.name?.trim().toLowerCase() === loweredName
    return {
      error: `A subcategory with this ${isNameDuplicate ? 'name' : 'slug'} already exists.`,
    }
  }

  return null
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const { id } = await params
    const body = await request.json()

    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 })
    }

    const uniquenessError = await ensureSubcategoryUniqueness(supabase, body.name, body.slug, id)
    if (uniquenessError) {
      return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('subcategories')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Subcategory updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /subcategories/[id] PUT error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update subcategory' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const { id } = await params

    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Subcategory deleted successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /subcategories/[id] DELETE error:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete subcategory' }, { status: 500 })
  }
}
