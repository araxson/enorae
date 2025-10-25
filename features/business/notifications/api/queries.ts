import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type NotificationsPageRow =
  Database['public']['Functions']['get_notifications_page']['Returns'][number]
type NotificationQueueRow =
  Database['public']['Views']['communication_notification_queue_view']['Row']
type NotificationEntry = {
  id: string
  user_id: string
  channels: string[]
  status: string | null
  created_at: string | null
  scheduled_for: string | null
  sent_at: string | null
  notification_type: string | null
  payload: NotificationPayload
  title?: string | null
  message?: string | null
  error?: string | null
  data?: Record<string, unknown> | null
}
type NotificationStatus = Database['public']['Enums']['notification_status']
type NotificationChannel = Database['public']['Enums']['notification_channel']
type NotificationType = Database['public']['Enums']['notification_type']
type NotificationPayload = {
  title?: string | null
  message?: string | null
  data?: Record<string, unknown> | null
}
type NotificationPreferencesMetadata = {
  email?: Partial<Record<NotificationType, boolean>>
  sms?: Partial<Record<NotificationType, boolean>>
  in_app?: Partial<Record<NotificationType, boolean>>
  push?: Record<string, boolean>
}

export type NotificationTemplate = {
  id: string
  name: string
  description?: string
  channel: NotificationChannel
  event: NotificationType
  subject?: string | null
  body: string
  updated_at?: string
  created_at?: string
}

const defaultPreferences = {
  email: {
    appointment_confirmation: true,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: true,
    staff_message: true,
    system_alert: true,
  },
  sms: {
    appointment_confirmation: false,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: false,
    staff_message: false,
    system_alert: false,
  },
  in_app: {
    appointment_confirmation: true,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: true,
    staff_message: true,
    system_alert: true,
  },
}

/**
 * Get unread notification count for current user
 */
export async function getUnreadCount() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Use RPC function to get unread count
  const { data: count, error } = await supabase
    .schema('communication')
    .rpc('get_unread_count', {
      p_user_id: user['id'],
    })

  if (error) throw error

  return count ?? 0
}

/**
 * Get unread counts for messages and notifications
 */
export async function getUnreadCounts() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Use RPC function to get unread counts
  const { data, error } = await supabase
    .schema('communication')
    .rpc('get_unread_counts', {
      p_user_id: user['id'],
    })

  if (error) throw error

  // Return first result or defaults
  const result = data && data.length > 0 ? data[0] : { messages: 0, notifications: 0, total: 0 }

  return {
    messages: result.messages ?? 0,
    notifications: result['notifications'] ?? 0,
    total: result.total ?? 0,
  }
}

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

  // Fetch notifications via authorized RPC
  const { data, error } = await supabase
    .schema('communication')
    .rpc('get_notifications_page', {
      p_user_id: user['id'],
      p_limit: limit,
    })
    .returns<NotificationsPageRow[]>()

  if (error) throw error

  return data ?? []
}

export async function getNotificationPreferences() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const metadataPreferences =
    (user.user_metadata?.['notification_preferences'] as NotificationPreferencesMetadata | undefined) || {}

  return {
    email: { ...defaultPreferences['email'], ...(metadataPreferences['email'] || {}) },
    sms: { ...defaultPreferences.sms, ...(metadataPreferences.sms || {}) },
    in_app: { ...defaultPreferences.in_app, ...(metadataPreferences.in_app || {}) },
    push: metadataPreferences.push || {},
  }
}

export async function getNotificationTemplates(): Promise<NotificationTemplate[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const stored = user.user_metadata?.['notification_templates'] as NotificationTemplate[] | undefined

  if (stored && Array.isArray(stored)) {
    return stored
  }

  // Provide default templates for common events
  return [
    {
      id: 'default-confirmation',
      name: 'Appointment Confirmation',
      channel: 'email',
      event: 'appointment_confirmation',
      subject: 'Your appointment is confirmed!',
      body:
        'Hi {{customer_name}}, your appointment for {{service_name}} on {{appointment_date}} is confirmed. We look forward to seeing you!',
    },
    {
      id: 'default-reminder',
      name: 'Appointment Reminder',
      channel: 'sms',
      event: 'appointment_reminder',
      body:
        'Reminder: {{service_name}} with {{staff_name}} at {{appointment_time}}. Reply YES to confirm or call us to reschedule.',
    },
  ]
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
    .eq('user_id', user['id'])
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
      payloadValue && typeof payloadValue.title === 'string' ? (payloadValue.title as string) : null
    const message =
      payloadValue && typeof payloadValue.message === 'string'
        ? (payloadValue.message as string)
        : null
    const errorMessage =
      payloadValue && typeof payloadValue.error === 'string'
        ? (payloadValue.error as string)
        : null
    const channels =
      payloadValue && Array.isArray(payloadValue.channels)
        ? (payloadValue.channels as string[])
        : ['in_app']
    const dataPayload =
      payloadValue && typeof payloadValue === 'object' && !Array.isArray(payloadValue)
        ? (payloadValue as Record<string, unknown>)
        : null

    return {
      id: entry.id,
      user_id: entry.user_id ?? user['id'],
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

export async function getNotificationStatistics() {
  const history = await getNotificationHistory(200)

  const totals = history.reduce<
    Record<NotificationStatus, { count: number; last?: string }>
  >((acc, entry) => {
    const status = (entry['status'] || 'queued') as NotificationStatus
    if (!acc[status]) {
      acc[status] = { count: 0, last: entry['created_at'] || undefined }
    }
    acc[status].count += 1
    if (entry['created_at']) {
      acc[status].last =
        !acc[status].last || entry['created_at'] > acc[status].last ? entry['created_at'] : acc[status].last
    }
    return acc
  }, {} as Record<NotificationStatus, { count: number; last?: string }>)

  const failureCount = history.filter((entry) => entry['status'] === 'failed' || entry['status'] === 'bounced').length

  const channels = history.reduce<Record<NotificationChannel, number>>((acc, entry) => {
    const entryChannels = (entry['channels'] || []) as NotificationChannel[]
    entryChannels.forEach((channel) => {
      acc[channel] = (acc[channel] || 0) + 1
    })
    return acc
  }, {} as Record<NotificationChannel, number>)

  return {
    totals,
    failureRate: history.length ? (failureCount / history.length) * 100 : 0,
    channels,
  }
}
