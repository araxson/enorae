import type { Database } from '@/lib/types/database.types'

/**
 * Communication and notification types
 * Used by messaging and notification features
 */

// Database views (using actual view names from schema)
export type MessageThread = Database['public']['Views']['communication_message_threads_view']['Row']
// NOTE: communication_message_view does not exist in database. Using messages table from communication schema.
// If a view is needed, it must be created in the database first.
export type Message = Database['communication']['Tables']['messages']['Row']
export type WebhookQueue = Database['public']['Views']['communication_webhook_queue_view']['Row']
export type NotificationQueueEntry = Database['public']['Views']['communication_notification_queue_view']['Row']

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
