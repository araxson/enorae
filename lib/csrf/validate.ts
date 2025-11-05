'use server'
import 'server-only'

/**
 * CSRF Protection for API Routes
 *
 * CRITICAL SECURITY:
 * - Validates CSRF tokens for all state-changing operations
 * - Uses double-submit cookie pattern
 * - Works with Next.js 15 Server Actions
 *
 * Based on OWASP CSRF Prevention Cheat Sheet
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
 */

import { cookies, headers } from 'next/headers'
import { logError } from '@/lib/observability'

// NOTE: generateCSRFToken has been moved to ./utils.ts to avoid 'use server' constraint.
// Import it directly from './utils' instead of from this file.

/**
 * CSRF token cookie name
 */
const CSRF_TOKEN_COOKIE = 'csrf-token'

/**
 * CSRF token header name
 */
const CSRF_TOKEN_HEADER = 'x-csrf-token'

/**
 * Validate CSRF token for incoming requests
 *
 * This implements the double-submit cookie pattern:
 * 1. Token is stored in a cookie (HttpOnly, SameSite=Strict)
 * 2. Token must also be sent in request header
 * 3. Both values must match
 *
 * @returns true if CSRF token is valid
 * @throws Error if CSRF token is invalid or missing
 */
export async function validateCSRF(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const headersList = await headers()

    // Get CSRF token from cookie
    const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value

    // Get CSRF token from header
    const headerToken = headersList.get(CSRF_TOKEN_HEADER)

    // CRITICAL SECURITY: Both must exist
    if (!cookieToken || !headerToken) {
      logError('CSRF validation failed: Missing token', {
        operationName: 'validateCSRF',
        error: 'CSRF token missing',
        errorCategory: 'permission',
        hasCookie: !!cookieToken,
        hasHeader: !!headerToken,
      })
      throw new Error('CSRF token missing')
    }

    // CRITICAL SECURITY: Both must match exactly
    if (cookieToken !== headerToken) {
      logError('CSRF validation failed: Token mismatch', {
        operationName: 'validateCSRF',
        error: 'Cookie and header tokens do not match',
        errorCategory: 'permission',
      })
      throw new Error('CSRF token mismatch')
    }

    return true
  } catch (error: unknown) {
    logError('CSRF validation error', {
      operationName: 'validateCSRF',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCategory: 'permission',
    })
    throw error
  }
}

// generateCSRFToken has been moved to ./utils.ts and is re-exported above
// This keeps the 'use server' constraint on validate.ts while allowing
// the pure utility function to be used without async requirement

/**
 * Validate CSRF token with custom error handling
 *
 * Use this in API routes where you want to handle CSRF failures gracefully
 *
 * @returns Object with success status and optional error message
 */
export async function validateCSRFSafe(): Promise<{ success: boolean; error?: string }> {
  try {
    await validateCSRF()
    return { success: true }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'CSRF validation failed',
    }
  }
}
