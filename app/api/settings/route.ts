import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error) throw error

    // Transform from row array [{key: 'shipping', value: '500'}] to object {shipping: '500'}
    const settingsObject = settings.reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

    return NextResponse.json({ data: settingsObject })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch settings' }, { status: 500 })
  }
}
