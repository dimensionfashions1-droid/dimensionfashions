'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Determine where to redirect based on the user's role
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: dbUser } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
    if (dbUser?.is_admin) {
      redirect('/admin/dashboard')
    }
  }

  // Use a query parameter redirect or default to home/profile
  const next = formData.get('next') as string | null
  redirect(next || '/profile')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const First = formData.get('first_name') as string
  const Last = formData.get('last_name') as string

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
            first_name: First,
            last_name: Last
        }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
