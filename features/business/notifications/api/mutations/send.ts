import 'server-only'

import type { Json } from '@/lib/types/database.types'
import { notificationSchema, getSupabaseClient, ensureRecipientAuthorized, revalidateNotifications, notificationIdsSchema } from './helpers'

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
    throw new Error(validation.error.errors[0].message)
  }

  const { userId, title, message, type, channels, data } = validation.data

  await ensureRecipientAuthorized(supabase, userId)

  // Send notification using RPC function
  const payloadData = data ? (JSON.parse(JSON.stringify(data)) as Json) : undefined

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
    throw new Error(validation.error.errors[0].message)
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
