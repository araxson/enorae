'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { UUID_REGEX } from './schemas'

/**
 * Mark messages from a specific user as read
 */
export async function markMessagesAsRead(fromUserId: string) {
  try {
    // Validate ID
    if (!UUID_REGEX.test(fromUserId)) {
      return { error: 'Invalid user ID' }
    }

    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAuth()

    // Mark all messages from the specified user to current user as read
    // Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('from_user_id', fromUserId)
      .eq('to_user_id', session.user.id)
      .eq('is_read', false)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages', 'page')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to mark messages as read' }
  }
}

/**
 * Mark a thread as unread
 */
export async function markThreadAsUnread(threadId: string) {
  try {
    // Validate ID
    if (!UUID_REGEX.test(threadId)) {
      return { error: 'Invalid thread ID' }
    }

    const supabase = await createClient()
    const session = await requireAuth()

    // Mark all messages in thread as unread for current user
    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({
        is_read: false,
        read_at: null,
      })
      .eq('context_id', threadId)
      .eq('to_user_id', session.user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages', 'page')
    revalidatePath('/business/messages', 'page')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to mark thread as unread' }
  }
}
