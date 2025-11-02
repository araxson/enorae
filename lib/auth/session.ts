'use server'
import 'server-only'

/**
 * Secure Session Verification - DAL Pattern
 *
 * CRITICAL SECURITY:
 * - ALWAYS use getUser() instead of getSession()
 * - getSession() reads from cookies (can be spoofed)
 * - getUser() validates with Supabase servers (secure)
 *
 * Based on Next.js 15 + Supabase security best practices
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { User } from '@supabase/supabase-js'
import { logAuthEvent, logError } from '@/lib/observability'

type RoleType = Database['public']['Enums']['role_type']

export interface Session {
  user: User
  role: RoleType
}

/**
 * Verify user session - SECURE
 *
 * This function:
 * 1. Uses getUser() to validate auth with Supabase servers
 * 2. Fetches user role from database
 * 3. Returns null if not authenticated
 * 4. Cached per request for performance
 *
 * SECURITY: Always use this instead of getSession()
 */
export const verifySession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient()

  // CRITICAL: Use getUser() NOT getSession()
  // getUser() validates the JWT with Supabase servers
  // getSession() only reads cookies (can be spoofed)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    logAuthEvent('auth_failure', {
      operationName: 'verifySession',
      reason: error?.message || 'No user found',
      success: false,
    })
    return null
  }

  // Get user role from database
  const { data: roleData, error: roleError } = await supabase
    .schema('identity').from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single<{ role: RoleType }>()

  if (!roleData?.role) {
    logError('verifySession: No role found for user', {
      operationName: 'verifySession',
      userId: user.id,
      error: roleError?.message || 'Role data missing',
    })
    return null
  }

  logAuthEvent('session_refresh', {
    operationName: 'verifySession',
    userId: user.id,
    success: true,
  })

  return {
    user,
    role: roleData.role,
  }
})

/**
 * Require authentication - throws if not authenticated
 *
 * Use in Server Components and Server Actions to protect routes
 *
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await verifySession()

  if (!session) {
    logAuthEvent('auth_failure', {
      operationName: 'requireAuth',
      reason: 'No valid session',
      success: false,
    })
    throw new Error('Unauthorized - Authentication required')
  }

  return session
}

/**
 * Require specific role - throws if user doesn't have the role
 *
 * @throws Error if not authenticated or doesn't have role
 */
export async function requireRole(role: RoleType): Promise<Session> {
  const session = await requireAuth()

  if (session.role !== role) {
    logAuthEvent('permission_check', {
      operationName: 'requireRole',
      userId: session.user.id,
      reason: `Role mismatch: has ${session.role}, needs ${role}`,
      success: false,
    })
    throw new Error(`Unauthorized - ${role} role required`)
  }

  logAuthEvent('permission_check', {
    operationName: 'requireRole',
    userId: session.user.id,
    success: true,
  })

  return session
}

/**
 * Require any of the specified roles
 *
 * @throws Error if not authenticated or doesn't have any role
 */
export async function requireAnyRole(roles: RoleType[]): Promise<Session> {
  const session = await requireAuth()

  if (!roles.includes(session.role)) {
    logAuthEvent('permission_check', {
      operationName: 'requireAnyRole',
      userId: session.user.id,
      reason: `Role mismatch: has ${session.role}, needs one of [${roles.join(', ')}]`,
      success: false,
    })
    throw new Error(`Unauthorized - One of [${roles.join(', ')}] roles required`)
  }

  logAuthEvent('permission_check', {
    operationName: 'requireAnyRole',
    userId: session.user.id,
    success: true,
  })

  return session
}

/**
 * Get user ID (convenience helper)
 */
export async function getUserId(): Promise<string | null> {
  const session = await verifySession()
  return session?.user.id || null
}

/**
 * Get user role (convenience helper)
 */
export async function getUserRole(): Promise<RoleType | null> {
  const session = await verifySession()
  return session?.role || null
}
