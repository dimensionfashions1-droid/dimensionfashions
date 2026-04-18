import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/check-admin'
import { uploadImage } from '@/lib/supabase/storage'

export async function POST(request: Request) {
  // 1. Authenticate Admin
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string || 'products'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 2. Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!validMimes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and AVIF are allowed.' }, { status: 400 })
    }

    // 3. Prevent monstrous uploads (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024 
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 })
    }

    // 4. Actively Upload via generic utility mapping
    const fileUrl = await uploadImage(file, folder)

    return NextResponse.json({ data: { url: fileUrl }, message: 'Upload successful' })

  } catch (error: unknown) {
    const err = error as Error
    console.error('API /upload POST error:', err)
    return NextResponse.json({ error: err.message || 'Failed to process file upload' }, { status: 500 })
  }
}
