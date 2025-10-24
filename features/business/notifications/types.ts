import type { Database } from '@/lib/types/database.types'

/**
 * Communication and notification types
 * Used by messaging and notification features
 */

// Database views
export type MessageThread = Database['public']['Views']['communication_message_threads']['Row']
export type Message = Database['public']['Views']['communication_messages']['Row']
export type WebhookQueue = Database['public']['Views']['communication_webhook_queue']['Row']
export type NotificationQueueEntry = Database['public']['Views']['communication_notification_queue']['Row']

// Notification payload types
export type NotificationPayload = Record<string, unknown>

export type NotificationEntry = {
  id: string
  user_id: string
  channels: string[]
  status: string | null
  created_at: string | null
  scheduled_for: string | null
  sent_at: string | null
  notification_type: string | null
  payload: NotificationPayload | null
  title?: string | null
  message?: string | null
  error?: string | null
  event_type?: string | null
  data?: NotificationPayload | null
}
