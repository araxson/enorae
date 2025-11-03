/**
 * Centralized Auth Guard for Query Functions
 *
 * Eliminates the repeated pattern:
 * ```ts
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 * if (!user) throw new Error('Unauthorized')
 * ```
 *
 * Usage in query files:
 * ```ts
 * import 'server-only'
 * import { guardQuery } from '@/lib/auth/guards-query'
 *
 * export async function getMyData() {
 *   const { user, supabase } = await guardQuery()
 *   return supabase.from('table').select('*').eq('user_id', user.id)
 * }
 * ```
 */

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

export type GuardedQuery = {
  user: User
  supabase: SupabaseClient<Database>
}

/**
 * Guard a query function with auth check
 * Returns authenticated user and Supabase client
 * @throws Error if user is not authenticated
 */
export async function guardQuery(): Promise<GuardedQuery> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return { user, supabase }
}

/**
 * Guard a query function and return only the user
 * Use when you already have supabase client or don't need it
 * @throws Error if user is not authenticated
 */
export async function guardQueryUser(): Promise<User> {
  const { user } = await guardQuery()
  return user
}

/**
 * Guard a query function with custom error message
 * @throws Error with custom message if user is not authenticated
 */
export async function guardQueryWithMessage(message: string): Promise<GuardedQuery> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error(message)
  }

  return { user, supabase }
}
