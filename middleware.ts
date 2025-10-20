/**
 * Next.js 15 Middleware - Minimal Security Pattern
 *
 * SECURITY BEST PRACTICES:
 * 1. NO database queries (moved to Server Components)
 * 2. NO complex role-based logic (moved to Server Components)
 * 3. ONLY session refresh + basic route protection
 * 4. Protection against CVE-2025-29927
 * 5. Rate limiting on auth routes (brute force protection)
 * 6. Security headers (CSP, etc.)
 *
 * Based on:
 * - Next.js 15 Authentication Guide
 * - Supabase SSR Documentation
 * - CVE-2025-29927 Remediation
 * - OWASP Rate Limiting Best Practices
 */

import { NextResponse, type NextRequest } from 'next/server'
import { authRateLimiter } from '@/lib/rate-limit'
import { env } from '@/lib/env'
import { updateSession } from '@/lib/supabase/middleware'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
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

// Auth routes that need rate limiting
const AUTH_ROUTES = ['/login', '/signup', '/auth/forgot-password', '/auth/reset-password']

// Protected portal routes (auth required, role checked in Server Components)
const PROTECTED_PORTALS = ['/admin', '/business', '/staff', '/customer']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ============================================================================
  // SECURITY: Block CVE-2025-29927 - Middleware Authorization Bypass
  // ============================================================================
  // Attackers can bypass middleware using x-middleware-subrequest header
  // Solution: Drop requests with this header
  if (request.headers.get('x-middleware-subrequest')) {
    return new Response('Forbidden', { status: 403 })
  }

  // ============================================================================
  // SECURITY: Rate Limiting for Auth Routes
  // ============================================================================
  // Prevent brute force attacks on login/signup
  const isAuthRoute = AUTH_ROUTES.some((route) => {
    if (pathname === route) return true
    const normalizedRoute = route.endsWith('/') ? route : `${route}/`
    return pathname.startsWith(normalizedRoute)
  })

  if (isAuthRoute) {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const forwardedIp = forwardedFor?.split(',')[0]?.trim()
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    const ip = forwardedIp ?? realIp ?? cfConnectingIp ?? '127.0.0.1'
    const { success, limit, remaining, reset } = await authRateLimiter.limit(ip)

    if (!success) {
      const response = new Response('Too Many Requests - Please try again later', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        }
      })
      return response
    }
  }

  // ============================================================================
  // Session Management - SEC-H103: Use updateSession() for proper token rotation
  // ============================================================================
  const { response, user } = await updateSession(request)
  const isAuthenticated = !!user

  // ============================================================================
  // Route Protection - Basic Auth Check Only
  // ============================================================================
  // NOTE: Role-based authorization happens in Server Components (NOT here)

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === '/') {
      return pathname === '/'
    }
    if (pathname === route) {
      return true
    }
    const normalizedRoute = route.endsWith('/') ? route : `${route}/`
    return pathname.startsWith(normalizedRoute)
  })

  // Allow public access to salon detail pages (read-only)
  // Note: Salon browsing is now under /customer/salons but requires auth
  const isSalonDetailRoute = false // All salon routes now require authentication

  // Allow public routes
  if (isPublicRoute || isSalonDetailRoute) {
    return addSecurityHeaders(response)
  }

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_PORTALS.some((portal) => pathname.startsWith(portal))

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Add security headers and return
  return addSecurityHeaders(response)
}

/**
 * Add security headers to response
 *
 * Includes:
 * - Content Security Policy (CSP)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Generate nonce for CSP
  const nonce = crypto.randomUUID().replace(/-/g, '')
  const isDev = process.env.NODE_ENV === 'development'

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}' 'strict-dynamic'`} https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' ${env.NEXT_PUBLIC_SUPABASE_URL} https://api.supabase.com wss://*.supabase.co;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Store nonce for use in pages (if needed)
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
