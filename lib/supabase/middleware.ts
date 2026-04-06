import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refresh the active session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      // no user, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Protect protected Store Routes (e.g., checkout/profile) if needed
  if (request.nextUrl.pathname.startsWith('/checkout') || request.nextUrl.pathname.startsWith('/profile')) {
    if (!user) {
       // redirect to login with a ?next= query param
       const url = request.nextUrl.clone()
       url.pathname = '/login'
       url.searchParams.set('next', request.nextUrl.pathname)
       return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
