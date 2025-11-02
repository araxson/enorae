import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Simple auth guard utilities for queries and mutations
 * Provides a consistent pattern for authentication checks across the codebase
 */

/**
 * Get authenticated user - throws if not authenticated
 * Use this in queries and mutations instead of raw getUser() + error check
 *
 * @throws Error if not authenticated
 * @returns Authenticated user object
 */
export async function requireUser(): Promise<User> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Get authenticated user or null
 * Use this when authentication is optional
 *
 * @returns User object or null
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Verify user owns resource by user_id
 * Common pattern for checking resource ownership
 *
 * @throws Error if resource user_id doesn't match authenticated user
 */
export async function requireResourceOwnership(resourceUserId: string): Promise<User> {
  const user = await requireUser()

  if (user.id !== resourceUserId) {
    throw new Error('Forbidden - You do not have access to this resource')
  }

  return user
}
