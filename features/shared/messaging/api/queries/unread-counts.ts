import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface UnreadCounts {
  messages: number
  notifications: number
  total: number
}

export async function getUnreadCounts(userId: string): Promise<UnreadCounts | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Count unread messages
  const { count: messagesCount } = await supabase
    .from('communication_messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', userId)
    .eq('is_read', false)

  // Count unread notifications
  const { count: notificationsCount } = await supabase
    .from('communication_notification_queue')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending')

  const messages = messagesCount || 0
  const notifications = notificationsCount || 0

  return {
    messages,
    notifications,
    total: messages + notifications,
  }
}

export async function getMyUnreadCounts(): Promise<UnreadCounts | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return getUnreadCounts(user.id)
}
