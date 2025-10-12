import type { Database } from '@/lib/types/database.types'

export type Message = Database['public']['Views']['messages']['Row']
export type MessageThread = Database['public']['Views']['message_threads']['Row']

export type MessageStatus = 'active' | 'archived' | 'closed'
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent'
