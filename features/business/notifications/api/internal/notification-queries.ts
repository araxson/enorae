import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { NotificationEntry } from './types'

type NotificationsPageRow =
  Database['public']['Functions']['get_notifications_page']['Returns'][number]
type NotificationQueueRow =
  Database['public']['Views']['communication_notification_queue_view']['Row']

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

  // Fetch notifications via notification queue view
  // RPC 'get_notifications_page' does not exist - use direct query
  const { data, error } = await supabase
    .from('communication_notification_queue_view')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<NotificationsPageRow[]>()

  if (error) throw error

  return data ?? []
}

export async function getNotificationHistory(limit: number = 50): Promise<NotificationEntry[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Read notification queue via hardened view to preserve RLS
  const { data, error } = await supabase
    .from('communication_notification_queue_view')
    .select('id, created_at, notification_type, payload, sent_at, status, user_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<NotificationQueueRow[]>()

  if (error) {
    console.error('[getNotificationHistory] Error:', error)
    return []
  }

  const queueEntries = (data ?? []).filter(
    (entry): entry is NotificationQueueRow & { id: string } => typeof entry.id === 'string',
  )

  return queueEntries.map<NotificationEntry>((entry) => {
    const payloadValue = (entry.payload ?? null) as Record<string, unknown> | null
    const title =
      payloadValue && typeof payloadValue['title'] === 'string' ? (payloadValue['title'] as string) : null
    const message =
      payloadValue && typeof payloadValue['message'] === 'string'
        ? (payloadValue['message'] as string)
        : null
    const errorMessage =
      payloadValue && typeof payloadValue['error'] === 'string'
        ? (payloadValue['error'] as string)
        : null
    const channels =
      payloadValue && Array.isArray(payloadValue['channels'])
        ? (payloadValue['channels'] as string[])
        : ['in_app']
    const dataPayload =
      payloadValue && typeof payloadValue === 'object' && !Array.isArray(payloadValue)
        ? (payloadValue as Record<string, unknown>)
        : null

    return {
      id: entry.id,
      user_id: entry.user_id ?? user.id,
      channels,
      status: entry.status,
      created_at: entry.created_at,
      scheduled_for: null,
      sent_at: entry.sent_at,
      notification_type: entry.notification_type,
      payload: {
        title,
        message,
        data: dataPayload,
      },
      title,
      message,
      error: errorMessage,
      data: dataPayload,
    }
  })
}
