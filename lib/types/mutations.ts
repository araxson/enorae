/**
 * Shared mutation types for consistency across features
 */

import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

/**
 * Standard mutation options passed to mutation handlers
 */
export type MutationOptions = {
  session?: { user: User }
  skipAccessCheck?: boolean
  supabase?: SupabaseClient<Database>
  now?: () => Date
}

/**
 * Standard mutation result type
 */
export type MutationResult<T = unknown> = {
  data?: T
  error?: string
  success?: boolean
}

/**
 * Standard error response
 */
export function createErrorResult(message: string): MutationResult {
  return { error: message, success: false }
}

/**
 * Standard success response with data
 */
export function createSuccessResult<T>(data: T): MutationResult<T> {
  return { data, success: true }
}

/**
 * Type guard for mutation options
 */
export function isMutationOptions(value: unknown): value is MutationOptions {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }
  const obj = value as Record<string, unknown>
  const skipAccessCheck = obj['skipAccessCheck']
  return typeof skipAccessCheck === 'boolean' || typeof skipAccessCheck === 'undefined'
}
