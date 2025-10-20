import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { NotificationEntry } from './types'

type MessageRow = Database['public']['Views']['messages']['Row']

/**
 * Get recent notifications for business users
 * Since there's no notifications table in the schema, we use messages as notifications
 */
export async function getRecentNotifications(limit: number = 20) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get system messages that serve as notifications
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('to_user_id', user.id)
    .eq('context_type', 'system')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []) as MessageRow[]
}

export async function getNotificationHistory(limit: number = 50): Promise<NotificationEntry[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Note: communication_notification_queue table doesn't exist yet
  // Using messages table with system context as a workaround for notification history
  const { data, error } = await supabase
    .from('messages')
    .select('id, created_at, content, context_type')
    .eq('to_user_id', user.id)
    .eq('context_type', 'system')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getNotificationHistory] Error:', error)
    return []
  }

  // Map messages to NotificationEntry format
  const messages = (data ?? []) as Array<
    Pick<MessageRow, 'id' | 'created_at' | 'content' | 'context_type'>
  >

  const validMessages = messages.filter(
    (msg): msg is {
      id: string
      created_at: string | null
      content: string | null
      context_type: string | null
    } => typeof msg.id === 'string',
  )

  return validMessages.map<NotificationEntry>((msg) => ({
    id: msg.id,
    user_id: user.id,
    channels: ['in_app'],
    status: 'delivered',
    created_at: msg.created_at,
    scheduled_for: null,
    sent_at: msg.created_at,
    notification_type: 'system_alert',
    payload: { content: msg.content },
  }))
}
