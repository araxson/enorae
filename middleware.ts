import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Role-based route protection
const ROUTE_ROLES = {
  '/admin': ['super_admin', 'platform_admin'],
  '/business': ['tenant_owner', 'salon_owner', 'salon_manager'],
  '/staff': ['senior_staff', 'staff', 'junior_staff'],
  '/profile': ['customer', 'vip_customer', 'guest', 'senior_staff', 'staff', 'junior_staff'],
  '/book': ['customer', 'vip_customer', 'guest'],
}

// Default routes by role
const DEFAULT_ROUTES: Record<string, string> = {
  super_admin: '/admin',
  platform_admin: '/admin',
  tenant_owner: '/business',
  salon_owner: '/business',
  salon_manager: '/business',
  senior_staff: '/staff',
  staff: '/staff',
  junior_staff: '/staff',
  vip_customer: '/explore',
  customer: '/explore',
  guest: '/explore',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
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

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes - allow access without authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/explore',
    '/about',
    '/contact',
    '/faq',
    '/how-it-works',
    '/pricing',
    '/privacy',
    '/terms',
  ]

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Allow public access to salon detail pages (read-only)
  const isSalonDetailRoute = pathname.startsWith('/salons/') && !pathname.includes('/book')

  if (isPublicRoute || isSalonDetailRoute) {
    return supabaseResponse
  }

  // Protected routes - require auth
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const userRole = roleData?.role

  if (!userRole) {
    // No role assigned, redirect to home
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Check if route requires specific roles
  for (const [route, allowedRoles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole)) {
        // Redirect to user's default route
        const url = request.nextUrl.clone()
        url.pathname = DEFAULT_ROUTES[userRole] || '/'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
