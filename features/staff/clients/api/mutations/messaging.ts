'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import type { ActionResponse } from '../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'
import { STRING_LIMITS } from '@/lib/config/constants'

const messageClientSchema = z.object({
  customerId: z.string().uuid(),
  message: z.string().min(1).max(STRING_LIMITS.LONG_TEXT),
  subject: z.string().max(200).optional(),
})

/**
 * Send a message to a client
 * Creates or uses existing thread
 */
export async function messageClient(
  data: z.infer<typeof messageClientSchema>
): Promise<ActionResponse> {
  const logger = createOperationLogger('messageClient', {})
  logger.start()

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const validation = messageClientSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || "Validation failed" }
    }

    const { customerId, message, subject } = validation.data

    // Get staff profile
    const { data: staff } = await supabase
      .from('staff_profiles_view')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .single<{ id: string; salon_id: string }>()

    if (!staff?.id) {
      return { success: false, error: 'Staff profile not found' }
    }

    // Find or create thread
    let threadId: string

    const { data: existingThread } = await supabase
      .schema('communication').from('message_threads')
      .select('id')
      .eq('salon_id', staff.salon_id)
      .eq('customer_id', customerId)
      .eq('staff_id', staff.id)
      .single<{ id: string }>()

    if (existingThread?.id) {
      threadId = existingThread.id
    } else {
      // Create new thread
      const { data: newThread, error: threadError } = await supabase
        .schema('communication')
        .schema('communication').from('message_threads')
        .insert({
          salon_id: staff.salon_id,
          customer_id: customerId,
          staff_id: staff.id,
          subject: subject || 'Staff Message',
          status: 'open',
          priority: 'normal',
          last_message_at: new Date().toISOString(),
          last_message_by_id: session.user.id,
        })
        .select('id')
        .single<{ id: string }>()

      if (threadError || !newThread?.id) {
        throw threadError || new Error('Failed to create thread')
      }

      threadId = newThread.id
    }

    // Send message
    const { error: messageError } = await supabase
      .schema('communication')
      .schema('communication').from('messages')
      .insert({
        from_user_id: session.user.id,
        to_user_id: customerId,
        content: message,
        context_type: 'thread',
        context_id: threadId,
        is_read: false,
        created_at: new Date().toISOString(),
      })

    if (messageError) throw messageError

    // Update thread last_message_at and increment unread count
    const { data: currentThread } = await supabase
      .schema('communication').from('message_threads')
      .select('unread_count_customer')
      .eq('id', threadId)
      .single<{ unread_count_customer: number }>()

    await supabase
      .schema('communication')
      .schema('communication').from('message_threads')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_by_id: session.user.id,
        unread_count_customer: (currentThread?.unread_count_customer || 0) + 1,
      })
      .eq('id', threadId)

    revalidatePath('/staff/clients', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}
