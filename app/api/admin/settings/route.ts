import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

export async function PATCH(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const { settings } = await request.json()
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 })
    }

    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = await createAdminClient()

    // Update each setting. 
    // Since site_settings table uses 'key' as a unique constraint, we can use upsert.
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return supabase
        .from('site_settings')
        .upsert({ key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' })
    })

    const results = await Promise.all(updatePromises)
    const error = results.find(r => r.error)?.error

    if (error) throw error

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('API /api/admin/settings PATCH error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 })
  }
}
