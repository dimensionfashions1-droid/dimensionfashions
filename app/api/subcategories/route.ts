import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function POST(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('subcategories')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Subcategory created successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating subcategory:', err)
    return NextResponse.json({ error: err.message || 'Failed to create subcategory' }, { status: 500 })
  }
}
