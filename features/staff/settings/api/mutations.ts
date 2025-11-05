'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'
import type { UserPreferences } from '@/features/staff/settings/api/types'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to update preferences' }
    }

    // Get profile ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles_view')
      .select('id')
      .eq('user_id', user.id)
      .single<{ id: string }>()

    if (profileError || !profile?.id) {
      console.error('Profile lookup error:', profileError)
      return { success: false, error: 'Profile not found. Please contact support.' }
    }

    // Update or create metadata with preferences
    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: profile.id,
        preferences: preferences as Json,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Preferences update error:', error)
      return { success: false, error: 'Failed to update preferences. Please try again.' }
    }

    revalidatePath('/staff/settings/preferences', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error updating preferences:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
