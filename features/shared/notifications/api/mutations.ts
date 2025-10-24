'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('communication_notification_queue')
    .update({
      status: 'delivered',
      sent_at: new Date().toISOString(),
    } as never)
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/notifications')
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('communication_notification_queue')
    .update({
      status: 'delivered',
      sent_at: new Date().toISOString(),
    } as never)
    .eq('user_id', user.id)
    .eq('status', 'pending')

  if (error) throw error

  revalidatePath('/notifications')
  return { success: true }
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('communication_notification_queue')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/notifications')
  return { success: true }
}

export async function sendNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>,
  channels?: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: Implement notification creation when RPC function types are available
  // The create_notification RPC function exists in the database but types are not exported
  console.log('[Notification] Would create:', { userId, type, title, message, channels, data })

  revalidatePath('/notifications')
  return { success: true }
}
