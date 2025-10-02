import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: profiles_preferences doesn't have public view yet

type ProfilePreference = Database['public']['Views']['profiles_preferences']['Row']

/**
 * Get all preferences for the current user
 */
export async function getUserPreferences(): Promise<ProfilePreference[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('profiles_preferences')
    .select('*')
    .eq('profile_id', user.id)
    .is('deleted_at', null)
    .order('preference_key', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get a single preference by key
 */
export async function getUserPreference(
  key: string
): Promise<ProfilePreference | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('profiles_preferences')
    .select('*')
    .eq('profile_id', user.id)
    .eq('preference_key', key)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}
