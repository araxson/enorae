'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('communication')
    .from('communication_notification_queue')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    })
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
    .schema('communication')
    .from('communication_notification_queue')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    })
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
    .schema('communication')
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

  const { error } = await supabase
    .rpc('send_notification', {
      p_user_id: userId,
      p_type: type,
      p_title: title,
      p_message: message,
      p_data: data || null,
      p_channels: channels || ['in_app'],
    })

  if (error) throw error

  revalidatePath('/notifications')
  return { success: true }
}
