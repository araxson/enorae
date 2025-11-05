'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function markNotificationAsRead(notificationId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to mark notifications as read' }
    }

    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('to_user_id', user.id)

    if (error) {
      console.error('Notification mark as read error:', error)
      return { success: false, error: 'Failed to mark notification as read. Please try again.' }
    }

    revalidatePath('/notifications', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error marking notification as read:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to mark notifications as read' }
    }

    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('to_user_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Mark all notifications as read error:', error)
      return { success: false, error: 'Failed to mark all notifications as read. Please try again.' }
    }

    revalidatePath('/notifications', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error marking all notifications as read:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function deleteNotification(notificationId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to delete notifications' }
    }

    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .delete()
      .eq('id', notificationId)
      .eq('to_user_id', user.id)

    if (error) {
      console.error('Notification deletion error:', error)
      return { success: false, error: 'Failed to delete notification. Please try again.' }
    }

    revalidatePath('/notifications', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting notification:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function sendNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>,
  channels?: string[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to send notifications' }
    }

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
      console.error('Notification send error:', error)
      return { success: false, error: 'Failed to send notification. Please try again.' }
    }

    revalidatePath('/notifications', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error sending notification:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
