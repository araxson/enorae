import 'server-only'

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

  const { data: notificationId, error } = await supabase.rpc(
    'send_notification',
    {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_channels: channels,
      p_data: data,
    },
  )

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

  const { data: count, error } = await supabase.rpc(
    'mark_notifications_read',
    {
      p_user_id: user.id,
      p_notification_ids: validation.data,
    },
  )

  if (error) throw error

  revalidateNotifications()
  return { success: true, markedCount: count }
}
