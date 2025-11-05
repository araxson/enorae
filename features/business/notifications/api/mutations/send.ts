'use server'
import 'server-only'

import type { Json } from '@/lib/types/database.types'
import { getSupabaseClient, ensureRecipientAuthorized } from './helpers'
import { notificationSchema, revalidateNotifications, notificationIdsSchema } from './utilities'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function sendNotification(input: {
  userId: string
  title: string
  message: string
  type: string
  channels?: string[]
  data?: Record<string, unknown>
}) {
  const logger = createOperationLogger('sendNotification', {})
  logger.start()

  // ASYNC FIX: Wrap in try-catch to handle all Promise rejections
  try {
    const supabase = await getSupabaseClient()

    const validation = notificationSchema.safeParse(input)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError ?? "Validation failed" }
    }

    const { userId, title, message, type, channels, data } = validation.data

    // Get current user for authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      logger.error(authError, 'auth')
      return { success: false, error: authError.message }
    }
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is authorized to send to this recipient
    const isAuthorized = await ensureRecipientAuthorized(userId, user.id)
    if (!isAuthorized) {
      return { success: false, error: 'Not authorized to send to this recipient' }
    }

    // Send notification using RPC function - use structuredClone for type-safe deep copy
    const payloadData = data ? (structuredClone(data) as Json) : undefined

    const { data: notificationId, error } = await supabase
      .schema('communication')
      .rpc('send_notification', {
        p_user_id: userId,
        p_title: title,
        p_message: message,
        p_type: type,
        p_channels: channels || ['in_app'],
        p_data: payloadData,
      })

    if (error) {
      logger.error(error, 'database')
      return { success: false, error: error.message }
    }

    revalidateNotifications()
    logger.success()
    return { success: true, notificationId }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send notification'
    logger.error(error instanceof Error ? error : new Error(String(error)), 'unknown')
    return { success: false, error: errorMessage }
  }
}

export async function markNotificationsRead(notificationIds?: string[]) {
  const logger = createOperationLogger('markNotificationsRead', {})
  logger.start()

  // ASYNC FIX: Wrap in try-catch to handle all Promise rejections
  try {
    const supabase = await getSupabaseClient()

    const validation = notificationIdsSchema.safeParse(notificationIds)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors ?? {})[0]?.[0]
      return { success: false, error: firstError ?? "Validation failed" }
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

    // Mark notifications as read using RPC function
    const { data: markedCount, error } = await supabase
      .schema('communication')
      .rpc('mark_notifications_read', {
        p_user_id: user.id,
        p_notification_ids: validation.data,
      })

    if (error) {
      logger.error(error, 'database')
      return { success: false, error: error.message }
    }

    revalidateNotifications()
    logger.success()
    return { success: true, markedCount: markedCount ?? 0 }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark notifications as read'
    logger.error(error instanceof Error ? error : new Error(String(error)), 'unknown')
    return { success: false, error: errorMessage }
  }
}
