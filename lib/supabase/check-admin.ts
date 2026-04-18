import { createClient } from './server'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: dbUser, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error || !dbUser?.is_admin) {
    return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
  }

  return null // Return null if authorization succeeds
}
