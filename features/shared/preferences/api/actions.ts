'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'

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
 * Update notification preferences (Server Action for forms)
 * Controls email, SMS, and push notification settings
 */
export async function updateNotificationPreferencesAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    const session = await requireAuth()

    // Parse boolean values from FormData (checkboxes)
    const preferences = {
      email_appointments: formData.get('email_appointments') === 'true',
      email_promotions: formData.get('email_promotions') === 'true',
      sms_reminders: formData.get('sms_reminders') === 'true',
      push_enabled: formData.get('push_enabled') === 'true',
    }

    const result = notificationPreferencesSchema.safeParse(preferences)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      return { success: false, error: 'Validation failed', fieldErrors }
    }

    const validated = result.data

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
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>
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
 * Update advanced preferences (Server Action for forms)
 * Controls regional and display settings
 */
export async function updateAdvancedPreferencesAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    const session = await requireAuth()

    const preferences = {
      timezone: formData.get('timezone')?.toString() || null,
      locale: formData.get('locale')?.toString() || null,
      currency_code: formData.get('currency_code')?.toString() || null,
    }

    const result = advancedPreferencesSchema.safeParse(preferences)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      return { success: false, error: 'Validation failed', fieldErrors }
    }

    const validated = result.data

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
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>
      }
    }
    console.error('Unexpected error updating advanced preferences:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
