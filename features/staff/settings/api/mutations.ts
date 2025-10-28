'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'
import type { UserPreferences } from '@/features/staff/settings/types'

export async function updateUserPreferences(preferences: Partial<UserPreferences>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get profile ID
  const { data: profile, error: profileError } = await supabase
    .from('profiles_view')
    .select('id')
    .eq('user_id', user.id)
    .single<{ id: string }>()

  if (profileError || !profile?.id) throw new Error('Profile not found')

  // Update or create metadata with preferences
  const { error } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .upsert({
      profile_id: profile.id,
      preferences: preferences as Json,
      updated_at: new Date().toISOString(),
    })

  if (error) throw error

  revalidatePath('/staff/settings/preferences', 'page')
}
