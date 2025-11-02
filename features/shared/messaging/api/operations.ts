import 'server-only'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Messaging operation utilities
 * Consolidates message-related operations used across staff/shared messaging features
 */

export interface MessageInput {
  from_user_id: string
  to_user_id: string
  content: string
  context_type?: string
  context_id?: string | null
}

export interface ThreadInfo {
  id: string
  staff_id: string | null
  customer_id: string | null
}

/**
 * Create a message in the communication schema
 */
export async function createMessage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  message: MessageInput
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .insert({
      from_user_id: message.from_user_id,
      to_user_id: message.to_user_id,
      content: message.content,
      context_type: message.context_type || 'general',
      context_id: message.context_id || null,
      is_read: false,
      is_edited: false,
      is_deleted: false,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Mark messages as read for a user
 */
export async function markMessagesAsRead(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  threadId?: string
): Promise<{ success: boolean; error?: string }> {
  let query = supabase
    .schema('communication')
    .from('messages')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('to_user_id', userId)
    .eq('is_read', false)

  // Optionally filter by thread
  if (threadId) {
    // Add thread filter if needed
  }

  const { error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Get thread details by ID
 */
export async function getThread(
  supabase: Awaited<ReturnType<typeof createClient>>,
  threadId: string
): Promise<ThreadInfo | null> {
  const { data, error } = await supabase
    .schema('communication')
    .from('message_threads')
    .select('id, staff_id, customer_id')
    .eq('id', threadId)
    .single<ThreadInfo>()

  if (error || !data) return null
  return data
}

/**
 * Archive a thread
 */
export async function archiveThread(
  supabase: Awaited<ReturnType<typeof createClient>>,
  threadId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .schema('communication')
    .from('message_threads')
    .update({
      status: 'archived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', threadId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Delete a message (soft delete)
 */
export async function deleteMessage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  messageId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', messageId)
    .eq('from_user_id', userId) // Only allow deleting own messages

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Revalidate message paths
 */
export function revalidateMessagePaths(portal: 'staff' | 'customer', threadId?: string) {
  if (threadId) {
    revalidatePath(`/${portal}/messages/${threadId}`, 'page')
  }
  revalidatePath(`/${portal}/messages`, 'page')
}
