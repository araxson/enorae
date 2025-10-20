import type { Database } from '../database.types'

export type MessageThread = Database['public']['Views']['communication_message_threads']['Row']
export type Message = Database['public']['Views']['communication_messages']['Row']
export type WebhookQueue = Database['public']['Views']['communication_webhook_queue']['Row']
export type NotificationQueueEntry = Database['public']['Views']['communication_notification_queue']['Row']
