'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId)
    .eq('to_user_id', user.id)

  if (error) throw error

  revalidatePath('/notifications', 'page')
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('to_user_id', user.id)
    .eq('is_read', false)

  if (error) throw error

  revalidatePath('/notifications', 'page')
  return { success: true }
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .delete()
    .eq('id', notificationId)
    .eq('to_user_id', user.id)

  if (error) throw error

  revalidatePath('/notifications', 'page')
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

  // Send notification as a message
  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .insert({
      from_user_id: user.id,
      to_user_id: userId,
      content: message,
      context_type: type,
      is_read: false,
    })

  if (error) {
    console.error('[Notification] Failed to send:', error)
    return { success: false }
  }

  revalidatePath('/notifications', 'page')
  return { success: true }
}
