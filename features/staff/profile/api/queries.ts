import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = Database['public']['Views']['staff']['Row']
type StaffProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row']
type PublicProfile = Database['public']['Views']['profiles']['Row']

export interface StaffProfileDetails {
  profile: StaffProfile | null
  metadata: StaffProfileMetadata | null
  username: string | null
}

export async function getMyStaffProfile(): Promise<StaffProfile | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_view')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error) {
    console.error('Error fetching staff profile:', error)
    return null
  }

  return data
}

export async function getMyStaffProfileDetails(): Promise<StaffProfileDetails> {
  const profile = await getMyStaffProfile()

  if (!profile || !profile.user_id) {
    return {
      profile,
      metadata: null,
      username: null,
    }
  }

  const supabase = await createClient()

  const [metadataResult, profileResult] = await Promise.all([
    supabase
      .from('profiles_metadata_view')
      .select('*')
      .eq('profile_id', profile.user_id)
      .maybeSingle<StaffProfileMetadata>(),
    supabase
      .from('profiles_view')
      .select('username')
      .eq('id', profile.user_id)
      .maybeSingle<Pick<PublicProfile, 'username'>>(),
  ])

  if (metadataResult.error) throw metadataResult.error
  if (profileResult.error) throw profileResult.error

  return {
    profile,
    metadata: metadataResult.data ?? null,
    username: profileResult.data?.username ?? null,
  }
}
