import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Notification = Database['communication']['Tables']['notification_queue']['Row']

export async function getNotifications(limit = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('communication')
    .from('notification_queue')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Notification[]
}

export async function getUnreadNotificationsCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('communication')
    .from('notification_queue')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending')

  if (error) throw error
  return data?.length || 0
}

export async function getNotificationsByChannel(channel: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('communication')
    .from('notification_queue')
    .select('*')
    .eq('user_id', user.id)
    .contains('channels', [channel])
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data as Notification[]
}
