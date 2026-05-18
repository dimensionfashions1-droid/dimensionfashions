import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

async function ensureAttributeUniqueness(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  name: string,
  slug: string,
  excludeId: string
) {
  const loweredName = name.trim().toLowerCase()
  const loweredSlug = slug.trim().toLowerCase()

  const nameQuery = supabase
    .from('attribute_definitions')
    .select('id, name, slug')
    .neq('id', excludeId)
    .ilike('name', name.trim())

  const slugQuery = supabase
    .from('attribute_definitions')
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
      error: `An attribute with this ${isNameDuplicate ? 'name' : 'slug'} already exists.`,
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

    // Separate options from the definition fields
    const { options, ...definitionFields } = body

    if (definitionFields.name && definitionFields.slug) {
      const uniquenessError = await ensureAttributeUniqueness(
        supabase,
        definitionFields.name,
        definitionFields.slug,
        id
      )
      if (uniquenessError) {
        return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
      }
    }

    // 1. Update definition
    if (Object.keys(definitionFields).length > 0) {
      const { error } = await supabase
        .from('attribute_definitions')
        .update(definitionFields)
        .eq('id', id)

      if (error) throw error
    }

    // 2. Replace options if provided
    if (options && Array.isArray(options)) {
      const { data: existingOptions, error: existingError } = await supabase
        .from('attribute_options')
        .select('id')
        .eq('attribute_id', id)

      if (existingError) throw existingError

      const incomingIds = options.map((o: any) => o.id).filter(Boolean)
      const idsToDelete = (existingOptions || [])
        .map(eo => eo.id)
        .filter(eid => !incomingIds.includes(eid))

      if (idsToDelete.length > 0) {
        const { error: delError } = await supabase
          .from('attribute_options')
          .delete()
          .in('id', idsToDelete)

        if (delError) {
          if (delError.code === '23503') {
            return NextResponse.json({ error: 'Cannot delete an option that is currently in use by a product.' }, { status: 409 })
          }
          throw delError
        }
      }

      if (options.length > 0) {
        const optionRows = options.map((opt: any, index: number) => ({
          id: opt.id || crypto.randomUUID(),
          attribute_id: id,
          value: opt.value,
          hex_code: opt.hex_code || null,
          display_value: opt.display_value || null,
          display_order: opt.display_order ?? index,
        }))

        const { error: upsertError } = await supabase
          .from('attribute_options')
          .upsert(optionRows, { onConflict: 'id' })

        if (upsertError) throw upsertError
      }
    }

    return NextResponse.json({ message: 'Attribute updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /attributes/[id] PUT error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update attribute' }, { status: 500 })
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
      .from('attribute_definitions')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Attribute deleted successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /attributes/[id] DELETE error:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete attribute' }, { status: 500 })
  }
}
