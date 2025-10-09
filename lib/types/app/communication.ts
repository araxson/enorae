import type { Database } from '../database.types'

export type MessageThread = Database['public']['Views']['message_threads']['Row']
export type Message = Database['public']['Views']['messages']['Row']
export type WebhookQueue = Database['communication']['Tables']['webhook_queue']['Row']
