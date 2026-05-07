import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const { id } = await params

    // Fetch user profile from public.users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (userError) throw userError

    // Fetch email from auth metadata
    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(id)
    
    // We don't throw if auth fails, we just don't have the email
    const email = authUser?.email || null

    return NextResponse.json({ 
      data: { 
        ...user,
        email 
      } 
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/users/[id] GET error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch user' }, { status: 500 })
  }
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

    // Only allow updating specific fields (NOT email)
    const allowedFields: Record<string, any> = {}
    const permitted = ['first_name', 'last_name', 'phone', 'is_admin']

    for (const key of permitted) {
      if (key in body) {
        allowedFields[key] = body[key]
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'User updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /admin/users/[id] PUT error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 })
  }
}
