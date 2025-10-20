import type { Database } from '@/lib/types/database.types'

type MessageRow = Database['public']['Views']['messages']['Row']

export type NotificationStatus = Database['public']['Enums']['notification_status']
export type NotificationChannel = Database['public']['Enums']['notification_channel']
export type NotificationType = Database['public']['Enums']['notification_type']

export type NotificationEntry = {
  id: string
  user_id: string
  channels: string[]
  status: string | null
  created_at: string | null
  scheduled_for: string | null
  sent_at: string | null
  notification_type: string | null
  payload: NotificationPayload
}

export type NotificationPayload = {
  content: MessageRow['content']
  metadata?: MessageRow['metadata']
}

export type NotificationPreferencesMetadata = {
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
