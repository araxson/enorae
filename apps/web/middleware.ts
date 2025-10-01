import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/book',
    '/business',
    '/admin',
  ]

  // Public routes that authenticated users shouldn't access
  const authRoutes = ['/login', '/signup']

  const path = request.nextUrl.pathname

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone()

    // Determine where to redirect based on user type
    // This would need to be enhanced with actual user role checking
    redirectUrl.pathname = '/profile'

    // Check for redirect parameter
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    if (redirectTo && !redirectTo.startsWith('/login') && !redirectTo.startsWith('/signup')) {
      redirectUrl.pathname = redirectTo
      redirectUrl.searchParams.delete('redirectTo')
    }

    return NextResponse.redirect(redirectUrl)
  }

  // Business routes - check if user has business role
  if (path.startsWith('/business') && user) {
    // TODO: Check if user has business role
    // This would require fetching user profile/role from database
    // For now, we allow access if authenticated
  }

  // Admin routes - check if user has admin role
  if (path.startsWith('/admin') && user) {
    // Check if user has admin role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['super_admin', 'platform_admin'])
      .single()

    if (!userRole) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}