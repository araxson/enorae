import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type User = {
  id: string
  email?: string
  [key: string]: unknown
}

/**
 * Require authentication - throws if no user
 *
 * @returns Authenticated user
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Get salon for current authenticated user
 *
 * Finds the salon owned by the current user.
 * Commonly used in business portal features.
 *
 * @returns User's salon
 * @throws Error if not authenticated or no salon found
 */
export async function getUserSalon(): Promise<Salon> {
  const supabase = await createClient()

  // Check auth
  const user = await requireAuth()

  // Get user's salon
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch salon: ${error.message}`)
  }

  if (!data) {
    throw new Error('No salon found for this user')
  }

  return data as Salon
}

/**
 * Get salon ID for current authenticated user
 *
 * Convenience function that returns just the salon ID.
 * Use this when you only need the ID for queries.
 *
 * @returns Salon ID
 * @throws Error if not authenticated or no salon found
 */
export async function getUserSalonId(): Promise<string> {
  const salon = await getUserSalon()
  return salon.id
}

/**
 * Check if user is authenticated (without throwing)
 *
 * @returns User if authenticated, null otherwise
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Get user role
 *
 * @returns User role or null if not found
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getAuthUser()

  if (!user) {
    return null
  }

  const supabase = await createClient()

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return data?.role || null
}
