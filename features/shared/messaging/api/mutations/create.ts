'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { createThreadSchema, sendMessageSchema } from './schemas'
import { createOperationLogger } from '@/lib/observability'
import { revalidatePath } from 'next/cache'

/**
 * Create a new message thread
 */
export async function createThread(input: z.infer<typeof createThreadSchema>) {
  const logger = createOperationLogger('createThread')
  logger.start()

  try {
    const validated = createThreadSchema.parse(input)
    const supabase = await createClient()
    const session = await requireAuth()

    // Verify salon exists
    const { data: salon, error: salonError } = await supabase
      .from('salons_view')
      .select('id')
      .eq('id', validated.salon_id)
      .single()

    if (salonError || !salon) {
      logger.error('Salon not found', 'not_found', { salonId: validated.salon_id })
      return { error: 'Salon not found' }
    }

    const { data, error } = await supabase
      .schema('communication')
      .from('message_threads')
      .insert({
        salon_id: validated.salon_id,
        customer_id: session.user.id,
        subject: validated.subject || null,
        status: 'open',
        priority: validated.priority,
      })
      .select()
      .single()

    if (error) {
      logger.error('Thread creation failed', 'database', { error })
      return { error: error.message }
    }

    logger.success({ threadId: data.id })
    revalidatePath('/messages', 'page')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Validation failed' }
    }
    logger.error('Thread creation failed', 'unknown', { error })
    return { error: 'Failed to create thread' }
  }
}

/**
 * Send a direct message to another user
 */
export async function sendMessage(input: z.infer<typeof sendMessageSchema>) {
  const logger = createOperationLogger('sendMessage')
  logger.start()

  try {
    const validated = sendMessageSchema.parse(input)
    const supabase = await createClient()
    const session = await requireAuth()

    const { data, error } = await supabase
      .schema('communication')
      .from('messages')
      .insert({
        from_user_id: session.user.id,
        to_user_id: validated.to_user_id,
        content: validated.content,
        context_id: validated.context_id || null,
        context_type: validated.context_type || null,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      logger.error('Message send failed', 'database', { error })
      return { error: error.message }
    }

    logger.success({ messageId: data.id, toUserId: validated.to_user_id })
    revalidatePath('/messages', 'page')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Validation failed' }
    }
    logger.error('Message send failed', 'unknown', { error })
    return { error: 'Failed to send message' }
  }
}
