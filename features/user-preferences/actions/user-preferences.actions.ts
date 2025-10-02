'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const preferenceSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100),
  value: z.string().max(1000),
})

export async function upsertUserPreference(formData: FormData) {
  try {
    const result = preferenceSchema.safeParse({
      key: formData.get('key'),
      value: formData.get('value'),
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Get current preferences
    const { data: profile } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .select('preferences')
      .eq('profile_id', user.id)
      .single()

    const currentPrefs = (profile?.preferences as Record<string, string>) || {}
    const updatedPrefs = { ...currentPrefs, [data.key]: data.value }

    // Upsert preferences
    const { error: upsertError } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .upsert({
        profile_id: user.id,
        preferences: updatedPrefs,
      })

    if (upsertError) return { error: upsertError.message }

    revalidatePath('/settings/preferences')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to save preference' }
  }
}

export async function deleteUserPreference(formData: FormData) {
  try {
    const key = formData.get('key')?.toString()
    if (!key) return { error: 'Invalid key' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Get current preferences
    const { data: profile } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .select('preferences')
      .eq('profile_id', user.id)
      .single()

    if (!profile) return { error: 'Preferences not found' }

    const currentPrefs = (profile.preferences as Record<string, string>) || {}
    delete currentPrefs[key]

    // Update preferences
    const { error: updateError } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .update({ preferences: currentPrefs })
      .eq('profile_id', user.id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/settings/preferences')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete preference' }
  }
}
