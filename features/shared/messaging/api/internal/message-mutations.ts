'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { sendMessageSchema, UUID_REGEX } from './schemas'
import type { Database } from '@/lib/types/database.types'

type MessageThreadRow = Pick<
  Database['public']['Views']['communication_message_threads']['Row'],
  'id' | 'customer_id' | 'staff_id'
>

/**
 * Send a direct message to another user
 */
export async function sendMessage(input: z.infer<typeof sendMessageSchema>): Promise<{ data?: Database['communication']['Tables']['messages']['Row']; error: string | null }> {
  try {
    const validated = sendMessageSchema.parse(input)

    const supabase = await createClient()
    const session = await requireAuth()

    const { data: thread, error: threadError } = await supabase
      .from('communication_message_threads')
      .select('id, customer_id, staff_id')
      .eq('id', validated.thread_id)
      .maybeSingle<MessageThreadRow>()

    if (threadError) {
      return { error: threadError.message }
    }

    if (!thread) {
      return { error: 'Thread not found' }
    }

    const viewerId = session.user.id
    const isCustomer = thread.customer_id === viewerId
    const isStaff = thread.staff_id === viewerId

    if (!isCustomer && !isStaff) {
      return { error: 'Unauthorized' }
    }

    const recipientId = isCustomer ? thread.staff_id : thread.customer_id
    if (!recipientId) {
      return { error: 'This conversation does not have another participant yet.' }
    }

    const payload: Database['communication']['Tables']['messages']['Insert'] = {
      from_user_id: viewerId,
      to_user_id: recipientId,
      content: validated.content,
      context_id: thread.id,
      context_type: 'thread',
      is_read: false,
    }

    const { data, error } = await supabase
      .schema('communication')
      .from('messages')
      .insert(payload)
      .select()
      .single<Database['communication']['Tables']['messages']['Row']>()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')
    revalidatePath('/staff/messages')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error('sendMessage error:', error)
    return { error: 'Failed to send message' }
  }
}

/**
 * Mark messages from a specific user as read
 */
export async function markMessagesAsRead({ threadId }: { threadId: string }): Promise<{ success?: boolean; error: string | null }> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(threadId)) {
      return { error: 'Invalid thread ID' }
    }

    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAuth()

    const { data: thread, error: threadError } = await supabase
      .from('communication_message_threads')
      .select('id, customer_id, staff_id')
      .eq('id', threadId)
      .maybeSingle<MessageThreadRow>()

    if (threadError) {
      return { error: threadError.message }
    }

    if (!thread) {
      return { error: 'Thread not found' }
    }

    if (session.user.id !== thread.customer_id && session.user.id !== thread.staff_id) {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('context_type', 'thread')
      .eq('context_id', threadId)
      .eq('to_user_id', session.user.id)
      .eq('is_read', false)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')
    revalidatePath('/staff/messages')

    return { success: true, error: null }
  } catch (error) {
    console.error('markMessagesAsRead error:', error)
    return { error: 'Failed to mark messages as read' }
  }
}

/**
 * Delete a message (soft delete - only if user is sender)
 */
export async function deleteMessage(messageId: string): Promise<{ success?: boolean; error: string | null }> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(messageId)) {
      return { error: 'Invalid message ID' }
    }

    const supabase = await createClient()
    const session = await requireAuth()

    // Verify ownership before deleting
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('from_user_id')
      .eq('id', messageId)
      .single<Pick<Database['public']['Views']['messages']['Row'], 'from_user_id'>>()

    if (fetchError) {
      return { error: 'Message not found' }
    }

    if (message.from_user_id !== session.user.id) {
      return { error: 'Not authorized to delete this message' }
    }

    // Soft delete - mark as deleted
    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', messageId)
      .eq('from_user_id', session.user.id) // Security check

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')
    revalidatePath('/staff/messages')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to delete message' }
  }
}
