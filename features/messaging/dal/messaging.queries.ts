import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: message_threads and messages don't have public views yet
// Using schema access with RLS enforcement
type MessageThread = Database['communication']['Tables']['message_threads']['Row']
type Message = Database['communication']['Tables']['messages']['Row']

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
 * Get all message threads for a user
 */
export async function getMessageThreadsByUser(userId: string) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Ensure user can only see their own threads
  if (user.id !== userId) {
    throw new Error('Unauthorized: Cannot view other users threads')
  }

  const { data, error } = await supabase
    .from('message_threads')
    .select('*')
    .eq('customer_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get messages between current user and another user
 */
export async function getMessagesBetweenUsers(otherUserId: string) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get messages in both directions
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${user.id})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(userId: string) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (user.id !== userId) {
    throw new Error('Unauthorized')
  }

  // Count unread messages sent to the user
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return count || 0
}

/**
 * Get a single thread by ID
 */
export async function getThreadById(threadId: string) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('message_threads')
    .select('*')
    .eq('id', threadId)
    .single()

  if (error) throw error

  // Verify access
  if (data.customer_id !== user.id) {
    throw new Error('Unauthorized: Not your thread')
  }

  return data
}
