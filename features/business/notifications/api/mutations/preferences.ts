'use server'
import 'server-only'

import { z } from 'zod'
import { getSupabaseClient, revalidateNotifications } from './helpers'

const updatePreferencesSchema = z.object({
  preferences: z.object({
    email: z.record(z.string(), z.boolean()).optional(),
    sms: z.record(z.string(), z.boolean()).optional(),
    in_app: z.record(z.string(), z.boolean()).optional(),
    push: z.record(z.string(), z.boolean()).optional(),
  }),
})

export async function updateNotificationPreferences(preferences: {
  email?: Record<string, boolean>
  sms?: Record<string, boolean>
  in_app?: Record<string, boolean>
  push?: Record<string, boolean>
}) {
  const supabase = await getSupabaseClient()

  const validation = updatePreferencesSchema.safeParse({ preferences })
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? "Validation failed")
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_preferences: preferences,
    },
  })

  if (error) throw error

  revalidateNotifications()
  return { success: true }
}
