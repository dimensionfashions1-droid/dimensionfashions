import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/mail/mailer'
import { contactAcknowledgmentTemplate } from '@/lib/mail/templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, phone, subject, message }])

    if (error) throw error

    // SEND ACKNOWLEDGMENT EMAIL (Async)
    try {
      sendEmail({
        to: email,
        subject: `We've received your message - ${subject || 'Contact Inquiry'}`,
        html: contactAcknowledgmentTemplate({
          customerName: name,
          subject: subject || 'Contact Inquiry',
          message: message
        })
      })
    } catch (e) {
      console.error('Notification Error:', e)
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to send message' }, { status: 500 })
  }
}
