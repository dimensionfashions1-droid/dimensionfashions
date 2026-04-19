import { createAdminClient } from './server'

const BUCKET_NAME = 'Dimensions'

export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
  const supabase = await createAdminClient()

  // Generate unique filename to prevent collisions
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

export async function deleteImage(publicUrl: string): Promise<boolean> {
  const supabase = await createAdminClient()

  // Extract the relative path from the public URL
  // The URL format is roughly: https://<project_id>.supabase.co/storage/v1/object/public/Dimensions/products/filename.jpg
  // So we extract everything after the bucket name
  try {
    const urlParts = publicUrl.split(`/public/${BUCKET_NAME}/`)
    if (urlParts.length !== 2) {
      throw new Error("Invalid Supabase public URL format mapped to bucket")
    }

    const filePath = urlParts[1]
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw error

    return true
  } catch (error: any) {
    console.error('Storage deletion error:', error)
    return false
  }
}
