import { type NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * CRITICAL: Root proxy for automatic session refresh (Next.js 16)
 *
 * SECURITY:
 * - Automatically refreshes Supabase auth tokens
 * - Prevents random session logouts
 * - Required for Server Components to have fresh session cookies
 * - Must run on ALL routes (except static assets)
 * - Implements CSP with nonces and comprehensive security headers
 *
 * @see docs/rules/09-auth.md - Pattern 3: Proxy Session Refresh
 * @see docs/rules/04-nextjs.md - Pattern 18: Content Security Policy
 */
export async function proxy(request: NextRequest) {
  // CRITICAL: Refresh Supabase session first
  // This must happen before any other logic to prevent random logouts
  const { response } = await updateSession(request)

  // Generate unique nonce for CSP
  const nonce = randomBytes(16).toString('base64')

  // Content Security Policy with nonce support
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`, // unsafe-inline needed for Tailwind
    "img-src 'self' blob: data: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')

  // Security headers (Next.js 15/16 best practices)
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // Pass nonce to page via header (for use in layout/scripts)
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  runtime: 'nodejs', // Use Node.js runtime for full API access (Next.js 15.2+)
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (metadata files)
     * - Images and media files (svg, png, jpg, jpeg, gif, webp, ico)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
