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

    // Separate options from the definition fields
    const { options, ...definitionFields } = body

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
      // Delete existing options
      const { error: delError } = await supabase
        .from('attribute_options')
        .delete()
        .eq('attribute_id', id)

      if (delError) throw delError

      // Insert new options
      if (options.length > 0) {
        const optionRows = options.map((opt: { value: string; hex_code?: string; display_value?: string; display_order?: number }, index: number) => ({
          attribute_id: id,
          value: opt.value,
          hex_code: opt.hex_code || null,
          display_value: opt.display_value || null,
          display_order: opt.display_order ?? index,
        }))

        const { error: insError } = await supabase
          .from('attribute_options')
          .insert(optionRows)

        if (insError) throw insError
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
    const supabase = await createClient()
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
