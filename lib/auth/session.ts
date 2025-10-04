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

import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { User } from '@supabase/supabase-js'

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
    return null
  }

  // Get user role from database
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single<{ role: RoleType }>()

  if (!roleData?.role) {
    return null
  }

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
    throw new Error(`Unauthorized - ${role} role required`)
  }

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
    throw new Error(`Unauthorized - One of [${roles.join(', ')}] roles required`)
  }

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
