'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { UUID_REGEX, createThreadSchema, sendMessageSchema } from './schemas'

/**
 * Create a new message thread
 */
export async function createThread(input: z.infer<typeof createThreadSchema>) {
  try {
    // Validate input
    const validated = createThreadSchema.parse(input)

    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAuth()

    // Verify salon exists
    const { data: salon, error: salonError } = await supabase
      .from('salons_view')
      .select('id')
      .eq('id', validated.salon_id)
      .single()

    if (salonError || !salon) {
      return { error: 'Salon not found' }
    }

    // Create thread with correct status and priority enum values
    // Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

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
      return { error: error.message }
    }

    revalidatePath('/customer/messages', 'page')
    revalidatePath('/business/messages', 'page')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues?.[0]?.message ?? 'Validation failed' }
    }
    return { error: 'Failed to create thread' }
  }
}

/**
 * Send a direct message to another user
 */
export async function sendMessage(input: z.infer<typeof sendMessageSchema>) {
  try {
    // Validate input
    const validated = sendMessageSchema.parse(input)

    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAuth()

    // Send message using the actual database schema (from_user_id, to_user_id)
    // Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

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
      return { error: error.message }
    }

    revalidatePath('/customer/messages', 'page')
    revalidatePath('/business/messages', 'page')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues?.[0]?.message ?? 'Validation failed' }
    }
    return { error: 'Failed to send message' }
  }
}
