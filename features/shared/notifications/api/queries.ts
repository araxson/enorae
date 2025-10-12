import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'

// TODO: communication_notification_queue view doesn't exist yet
type Notification = {
  id: string
  user_id: string
  channels: string[]
  status: string | null
  created_at: string | null
  scheduled_for: string | null
  sent_at: string | null
  notification_type: string | null
  payload: Json | null
}

export async function getNotifications(limit = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('communication_notification_queue')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Notification[]
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_unread_count', { p_user_id: user.id })

  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }

  return data || 0
}

export async function getNotificationsByChannel(channel: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('communication_notification_queue')
    .select('*')
    .eq('user_id', user.id)
    .contains('channels', [channel])
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data as Notification[]
}