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

  // Redirect logged in users away from auth pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
      const url = request.nextUrl.clone()
      url.pathname = '/profile'
      return NextResponse.redirect(url)
  }

  // Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    // 1. Not logged in → redirect to admin login (unless already there)
    if (!user && !isLoginPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // 2. Logged in → verify is_admin from DB
    if (user) {
      const { data: dbUser } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      const isAdmin = dbUser?.is_admin === true

      if (!isAdmin && !isLoginPage) {
        // Logged in but NOT an admin → kick to storefront
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }

      if (isAdmin && isLoginPage) {
        // Admin visiting login page → redirect to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }

      if (!isAdmin && isLoginPage) {
        // Non-admin on login page → let them through (they can attempt login)
        // but they won't pass the check above once they try to navigate deeper
      }
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
