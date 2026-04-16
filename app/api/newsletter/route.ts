import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Already subscribed!' })
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to subscribe' }, { status: 500 })
  }
}
