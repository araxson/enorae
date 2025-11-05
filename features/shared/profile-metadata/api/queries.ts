import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// DATABASE PATTERN NOTE: Currently reading from identity.profiles_metadata table
// TODO: Create view view_profile_metadata in identity schema for proper read pattern
// View should include: metadata fields + profile context + computed fields
// Once view is created, update all queries to use: .from('view_profile_metadata')

type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']

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
    .schema('identity')
    .from('profiles_metadata')
    .select('profile_id, full_name, avatar_url, bio, phone_number, created_at, updated_at')
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