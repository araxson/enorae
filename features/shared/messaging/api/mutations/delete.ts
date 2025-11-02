'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { UUID_REGEX } from './schemas'
import { createOperationLogger } from '@/lib/observability'

/**
 * Delete a message (soft delete - only if user is sender)
 */
export async function deleteMessage(messageId: string) {
  const logger = createOperationLogger('deleteMessage', {})
  logger.start()

  try {
    // Validate ID
    if (!UUID_REGEX.test(messageId)) {
      return { error: 'Invalid message ID' }
    }

    const supabase = await createClient()
    const session = await requireAuth()

    // Verify ownership before deleting
    const { data: message, error: fetchError } = await supabase
      .schema('communication')
      .from('messages')
      .select('from_user_id')
      .eq('id', messageId)
      .single()

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

    revalidatePath('/customer/messages', 'page')
    revalidatePath('/business/messages', 'page')
    revalidatePath('/staff/messages', 'page')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to delete message' }
  }
}
