import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ProfileMetadata = Database['public']['Views']['profiles_metadata']['Row']

export async function getProfileMetadata(profileId: string): Promise<ProfileMetadata | null> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify this is user's own profile
  if (profileId !== user.id) {
    throw new Error('Unauthorized: Cannot access other profiles')
  }

  const { data, error } = await supabase
    .from('profiles_metadata')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data
}

export async function getCurrentUserMetadata(): Promise<ProfileMetadata | null> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return getProfileMetadata(user.id)
}
