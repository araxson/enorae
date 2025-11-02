'use server'
import 'server-only'

import { z } from 'zod'
import { getSupabaseClient, revalidateNotifications } from './utilities'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

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
  const logger = createOperationLogger('updateNotificationPreferences', {})
  logger.start()

  // ASYNC FIX: Wrap in try-catch to handle all Promise rejections
  try {
    const supabase = await getSupabaseClient()

    const validation = updatePreferencesSchema.safeParse({ preferences })
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? "Validation failed" }
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      logger.error(authError, 'auth')
      return { success: false, error: authError.message }
    }
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        notification_preferences: preferences,
      },
    })

    if (error) {
      logger.error(error, 'database')
      return { success: false, error: error.message }
    }

    revalidateNotifications()
    logger.success()
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences'
    logger.error(error instanceof Error ? error : new Error(String(error)), 'unknown')
    return { success: false, error: errorMessage }
  }
}
