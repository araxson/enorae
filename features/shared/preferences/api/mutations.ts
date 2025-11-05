'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

const preferenceSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100),
  value: z.string().max(1000),
})

/**
 * Upsert user preference
 * RATE LIMIT: 50 upserts per hour (allows frequent settings adjustments)
 */
export async function upsertUserPreference(formData: FormData) {
  try {
    // Rate limiting - 50 upserts per hour per IP
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('preference-upsert', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 50,
      windowMs: 3600000, // 1 hour
    })

    if (!rateLimitResult.success) {
      return {
        error: rateLimitResult.error || 'Too many preference changes. Try again later.',
      }
    }

    const result = preferenceSchema.safeParse({
      key: formData.get('key'),
      value: formData.get('value'),
    })

    if (!result.success) {
      return {
        error: 'Validation failed. Please check your input.',
        fieldErrors: result.error.flatten().fieldErrors
      }
    }

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

    if (upsertError) {
      console.error('Preference upsert error:', upsertError)
      return { error: 'Failed to save preference. Please try again.' }
    }

    revalidatePath('/settings/preferences', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error saving preference:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Delete user preference
 * RATE LIMIT: 20 deletes per hour (prevents abuse)
 */
export async function deleteUserPreference(formData: FormData) {
  try {
    // Rate limiting - 20 deletes per hour per IP
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('preference-delete', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 20,
      windowMs: 3600000, // 1 hour
    })

    if (!rateLimitResult.success) {
      return {
        error: rateLimitResult.error || 'Too many preference deletions. Try again later.',
      }
    }

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

    if (updateError) {
      console.error('Preference deletion error:', updateError)
      return { error: 'Failed to delete preference. Please try again.' }
    }

    revalidatePath('/settings/preferences', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting preference:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
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
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Update notification preferences
 * Controls email, SMS, and push notification settings
 */
export async function updateNotificationPreferences(
  preferences: z.infer<typeof notificationPreferencesSchema>
): Promise<ActionResponse> {
  try {
    // SECURITY: Use safeParse to avoid throwing errors in Server Actions
    const validation = notificationPreferencesSchema.safeParse(preferences)
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors,
      }
    }
    const validated = validation.data

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

    if (error) {
      console.error('Notification preferences update error:', error)
      return { success: false, error: 'Failed to update notification preferences. Please try again.' }
    }

    revalidatePath('/customer/settings/preferences', 'page')
    revalidatePath('/staff/settings/preferences', 'page')
    revalidatePath('/settings/preferences', 'page')

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: error.flatten().fieldErrors
      }
    }
    console.error('Unexpected error updating notification preferences:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
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
    // SECURITY: Use safeParse to avoid throwing errors in Server Actions
    const validation = advancedPreferencesSchema.safeParse(preferences)
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors,
      }
    }
    const validated = validation.data

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

    if (error) {
      console.error('Advanced preferences update error:', error)
      return { success: false, error: 'Failed to update advanced preferences. Please try again.' }
    }

    revalidatePath('/customer/settings/preferences', 'page')
    revalidatePath('/staff/settings/preferences', 'page')
    revalidatePath('/business/settings/preferences', 'page')
    revalidatePath('/settings/preferences', 'page')

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: error.flatten().fieldErrors
      }
    }
    console.error('Unexpected error updating advanced preferences:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
