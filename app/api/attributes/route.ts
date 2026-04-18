import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'
import { AttributeDefinitionRow, AttributeOptionRow } from '@/types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

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
  } catch (error: any) {
    console.error('Error fetching attributes:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch attributes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('attribute_definitions')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Attribute created successfully' })
  } catch (error: any) {
    console.error('Error creating attribute:', error)
    return NextResponse.json({ error: error.message || 'Failed to create attribute' }, { status: 500 })
  }
}
