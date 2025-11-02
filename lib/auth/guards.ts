import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Authentication guard utilities
 * Consolidates auth check patterns used across 40+ files
 */

export interface AuthGuardResult {
  user: User
  supabase: Awaited<ReturnType<typeof createClient>>
}

/**
 * Standard auth guard - throws on unauthorized
 * Use in queries.ts and mutations.ts
 */
export async function requireAuth(): Promise<AuthGuardResult> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return { user, supabase }
}

/**
 * Auth guard that returns error response instead of throwing
 * Use in mutations with ActionResponse pattern
 */
export async function requireAuthSafe(): Promise<
  | { success: true; user: User; supabase: Awaited<ReturnType<typeof createClient>> }
  | { success: false; error: string }
> {
  try {
    const result = await requireAuth()
    return { success: true, ...result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unauthorized',
    }
  }
}

/**
 * Get authenticated user or null (no throw)
 * Use when auth is optional
 */
export async function getAuthUser(): Promise<{
  user: User | null
  supabase: Awaited<ReturnType<typeof createClient>>
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return { user, supabase }
}
