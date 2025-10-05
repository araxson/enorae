import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ProfilePreference = Database['identity']['Tables']['profiles_preferences']['Row']

/**
 * Get all preferences for the current user
 */
export async function getUserPreferences(): Promise<ProfilePreference[]> {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit profile filter for security
  const { data, error } = await supabase
    .from('profiles_preferences')
    .select('*')
    .eq('profile_id', session.user.id)

  if (error) throw error
  return data || []
}

/**
 * Get a single preference by key
 */
export async function getUserPreference(
  key: string
): Promise<ProfilePreference | null> {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Get single preference record for profile
  const { data, error } = await supabase
    .from('profiles_preferences')
    .select('*')
    .eq('profile_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}
