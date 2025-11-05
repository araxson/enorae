import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createOperationLogger } from '@/lib/observability'

/**
 * Auth callback handler for email verification and OAuth flows
 * SECURITY: Properly handles code exchange for session
 */

// Next.js 15+: GET requests are NOT cached by default
// Auth callbacks must be dynamic (user-specific, one-time use)
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const logger = createOperationLogger('auth_callback', {})
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth/email verification errors
  if (error) {
    logger.error(`Auth callback error: ${error}`, 'auth', {
      error,
      errorDescription,
    })
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  // Exchange code for session
  if (code) {
    logger.start({ code: code.substring(0, 10) + '...' })
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      logger.error('Failed to exchange code for session', 'auth', {
        error: exchangeError.message,
      })
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`,
          request.url
        )
      )
    }

    logger.success({ redirectTo: next })
    // Successful authentication - redirect to intended destination
    return NextResponse.redirect(new URL(next, request.url))
  }

  // No code provided - redirect to login
  logger.warn('Auth callback called without code parameter', {})
  return NextResponse.redirect(new URL('/login', request.url))
}
