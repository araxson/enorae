import type { Database, Json } from '../database.types'

export type MessageThread = Database['public']['Views']['communication_message_threads']['Row']
export type Message = Database['public']['Views']['communication_messages']['Row']
export type WebhookQueue = Database['public']['Views']['communication_webhook_queue']['Row']

// TODO: communication_notification_queue view doesn't exist yet
export type NotificationQueueEntry = {
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
