import 'server-only'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { UserPreferences } from '@/features/staff/settings/types'

type ProfilesMetadataWithPreferences = {
  preferences?: UserPreferences | null
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notification_preferences: {
    appointments: ['email', 'in_app'],
    messages: ['email', 'in_app'],
    schedule_changes: ['email', 'in_app'],
    time_off_updates: ['email', 'in_app'],
    commission_updates: ['email'],
  },
  communication_preferences: {
    allow_client_messages: true,
    allow_team_messages: true,
    auto_reply_enabled: false,
    auto_reply_message: null,
  },
  privacy_settings: {
    profile_visible_to_clients: true,
    show_ratings: true,
    show_completed_appointments: true,
    allow_profile_search: true,
  },
  display_preferences: {
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    time_format: '12h',
  },
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get profile metadata which stores preferences
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single<{ id: string }>()

  if (!profile?.id) return DEFAULT_PREFERENCES

  const { data: metadata } = await supabase
    .from('profiles_metadata')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  if (!metadata) return DEFAULT_PREFERENCES

  // Parse preferences from metadata or return defaults
  const storedPreferences = (metadata as ProfilesMetadataWithPreferences).preferences
  return storedPreferences ?? DEFAULT_PREFERENCES
}
