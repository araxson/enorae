'use server'
import 'server-only'

import type { Json } from '@/lib/types/database.types'
import { getSupabaseClient, ensureRecipientAuthorized } from './helpers'
import { notificationSchema, revalidateNotifications, notificationIdsSchema } from './utilities'

export async function sendNotification(input: {
  userId: string
  title: string
  message: string
  type: string
  channels?: string[]
  data?: Record<string, unknown>
}) {
  const supabase = await getSupabaseClient()

  const validation = notificationSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? "Validation failed")
  }

  const { userId, title, message, type, channels, data } = validation.data

  // Get current user for authorization
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  // Check if user is authorized to send to this recipient
  const isAuthorized = await ensureRecipientAuthorized(userId, user.id)
  if (!isAuthorized) throw new Error('Not authorized to send to this recipient')

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

  if (error) throw error

  revalidateNotifications()
  return { success: true, notificationId }
}

export async function markNotificationsRead(notificationIds?: string[]) {
  const supabase = await getSupabaseClient()

  const validation = notificationIdsSchema.safeParse(notificationIds)
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? "Validation failed")
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  // Mark notifications as read using RPC function
  const { data: markedCount, error } = await supabase
    .schema('communication')
    .rpc('mark_notifications_read', {
      p_user_id: user.id,
      p_notification_ids: validation.data,
    })

  if (error) throw error

  revalidateNotifications()
  return { success: true, markedCount: markedCount ?? 0 }
}
