'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'

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
    // SECURITY: Require authentication
    const session = await requireAuth()

    // Get current preferences
    const { data: profile } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .select('preferences')
      .eq('profile_id', session.user['id'])
      .single()

    const currentPrefs = (profile?.['preferences'] as Record<string, string>) || {}
    const updatedPrefs = { ...currentPrefs, [data.key]: data.value }

    // Upsert preferences
    const { error: upsertError } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .upsert({
        profile_id: session.user['id'],
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
    // SECURITY: Require authentication
    const session = await requireAuth()

    // Get current preferences
    const { data: profile } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .select('preferences')
      .eq('profile_id', session.user['id'])
      .single()

    if (!profile) return { error: 'Preferences not found' }

    const currentPrefs = (profile['preferences'] as Record<string, string>) || {}
    delete currentPrefs[key]

    // Update preferences
    const { error: updateError } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .update({ preferences: currentPrefs })
      .eq('profile_id', session.user['id'])

    if (updateError) return { error: updateError.message }

    revalidatePath('/settings/preferences')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete preference' }
  }
}

const notificationPreferencesSchema = z.object({
  email_appointments: z.boolean().optional(),
  email_promotions: z.boolean().optional(),
  sms_reminders: z.boolean().optional(),
  push_enabled: z.boolean().optional(),
})

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Update notification preferences
 * Controls email, SMS, and push notification settings
 */
export async function updateNotificationPreferences(
  preferences: z.infer<typeof notificationPreferencesSchema>
): Promise<ActionResponse> {
  try {
    const validated = notificationPreferencesSchema.parse(preferences)
    const supabase = await createClient()
    const session = await requireAuth()

    // Get current preferences
    const { data: profile } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .select('preferences')
      .eq('profile_id', session.user['id'])
      .single()

    const currentPrefs = (profile?.['preferences'] as Record<string, unknown>) || {}

    // Update notification preferences
    const updatedPrefs = {
      ...currentPrefs,
      notifications: {
        ...(typeof currentPrefs['notifications'] === 'object' ? currentPrefs['notifications'] : {}),
        ...validated,
      },
    }

    // Upsert preferences
    const { error } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .upsert({
        profile_id: session.user['id'],
        preferences: updatedPrefs,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath('/customer/settings/preferences')
    revalidatePath('/staff/settings/preferences')
    revalidatePath('/settings/preferences')

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notification preferences',
    }
  }
}

const advancedPreferencesSchema = z.object({
  timezone: z.string().optional().nullable(),
  locale: z.string().optional().nullable(),
  currency_code: z.string().optional().nullable(),
})

/**
 * Update advanced preferences (timezone, locale, currency)
 * Controls regional and display settings
 */
export async function updateAdvancedPreferences(
  preferences: z.infer<typeof advancedPreferencesSchema>
): Promise<ActionResponse> {
  try {
    const validated = advancedPreferencesSchema.parse(preferences)
    const supabase = await createClient()
    const session = await requireAuth()

    // Upsert advanced preferences
    const { error } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .upsert({
        profile_id: session.user['id'],
        timezone: validated['timezone'],
        locale: validated['locale'],
        currency_code: validated['currency_code'],
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath('/customer/settings/preferences')
    revalidatePath('/staff/settings/preferences')
    revalidatePath('/business/settings/preferences')
    revalidatePath('/settings/preferences')

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update advanced preferences',
    }
  }
}
