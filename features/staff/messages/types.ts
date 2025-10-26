import type { Database } from '@/lib/types/database.types'

export type Message = Database['communication']['Tables']['messages']['Row']
export type MessageThread = Database['communication']['Tables']['message_threads']['Row']

export type MessageStatus = 'active' | 'archived' | 'closed'
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent'
