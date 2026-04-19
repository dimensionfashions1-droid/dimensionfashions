import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

async function ensureAttributeUniqueness(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  name: string,
  slug: string,
  excludeId?: string
) {
  const loweredName = name.trim().toLowerCase()
  const loweredSlug = slug.trim().toLowerCase()

  let nameQuery = supabase.from('attribute_definitions').select('id, name, slug').ilike('name', name.trim())
  let slugQuery = supabase.from('attribute_definitions').select('id, name, slug').ilike('slug', slug.trim())

  if (excludeId) {
    nameQuery = nameQuery.neq('id', excludeId)
    slugQuery = slugQuery.neq('id', excludeId)
  }

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

export async function GET(request: Request) {
  try {
    const supabase = await createAdminClient()

    // Fetch definitions
    const { data: attributes, error: attError } = await supabase
      .from('attribute_definitions')
      .select('*')
      .order('display_order', { ascending: true })

    if (attError) throw attError

    // Fetch options
    const { data: options, error: optError } = await supabase
      .from('attribute_options')
      .select('*')
      .order('display_order', { ascending: true })

    if (optError) throw optError

    // Group options by attribute_id
    const attributesWithOptions = (attributes as AttributeDefinitionRow[]).map((attr) => {
      return {
        ...attr,
        options: (options as AttributeOptionRow[]).filter((opt) => opt.attribute_id === attr.id)
      }
    })

    return NextResponse.json({ data: attributesWithOptions })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error fetching attributes:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch attributes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const body = await request.json()

    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 })
    }

    const uniquenessError = await ensureAttributeUniqueness(supabase, body.name, body.slug)
    if (uniquenessError) {
      return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('attribute_definitions')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Attribute created successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating attribute:', err)
    return NextResponse.json({ error: err.message || 'Failed to create attribute' }, { status: 500 })
  }
}
