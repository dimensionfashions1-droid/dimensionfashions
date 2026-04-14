import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
       // Sign out immediately so they have to manually login
       await supabase.auth.signOut()
       // redirect to login safely with ?verified=true
       return NextResponse.redirect(`${origin}/login?verified=true`)
    }
  }

  // URL to redirect to if sign in failed
  return NextResponse.redirect(`${origin}/login?callbackError=true`)
}
