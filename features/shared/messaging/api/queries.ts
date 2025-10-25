import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { MessageThread } from '@/features/business/notifications'

export interface MessageThreadWithMetadata extends MessageThread {
  unread_count: number
}

export interface DirectMessage {
  id: string
  from_user_id: string
  to_user_id: string
  content: string
  is_read: boolean
  read_at: string | null
  created_at: string
  from_user_name?: string
  to_user_name?: string
}

/**
 * Get all message threads for the authenticated user
 */
export async function getMessageThreadsByUser() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('message_threads')
    .select('*')
    .eq('customer_id', session.user['id'])
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get messages between current user and another user
 */
export async function getMessagesBetweenUsers(otherUserId: string) {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Get messages in both directions - explicit filter for security
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_user_id.eq.${session.user['id']},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${session.user['id']})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get unread message count for the authenticated user
 */
export async function getUnreadCount() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Count unread messages sent to the user
  const { count, error} = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', session.user['id'])
    .eq('is_read', false)

  if (error) throw error
  return count || 0
}

/**
 * Get a single thread by ID
 */
export async function getThreadById(threadId: string): Promise<MessageThread> {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit filter for security
  const { data, error } = await supabase
    .from('message_threads')
    .select('*')
    .eq('id', threadId)
    .single<MessageThread>()

  if (error) throw error

  // Verify access
  if (data['customer_id'] !== session.user['id']) {
    throw new Error('Unauthorized: Not your thread')
  }

  return data
}