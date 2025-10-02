'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Validation schemas
const createThreadSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  subject: z.string().min(1, 'Subject is required').optional(),
})

const sendMessageSchema = z.object({
  to_user_id: z.string().regex(UUID_REGEX, 'Invalid recipient ID'),
  content: z.string().min(1, 'Message content is required'),
  context_id: z.string().regex(UUID_REGEX, 'Invalid context ID').optional(),
  context_type: z.string().optional(),
})

/**
 * Create a new message thread
 */
export async function createThread(input: z.infer<typeof createThreadSchema>) {
  try {
    // Validate input
    const validated = createThreadSchema.parse(input)

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Verify salon exists
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id')
      .eq('id', validated.salon_id)
      .single()

    if (salonError || !salon) {
      return { error: 'Salon not found' }
    }

    // Create thread with correct status enum value
    // Note: message_threads doesn't have a public view yet, keeping .schema() for now
    const { data, error } = await supabase
      .schema('communication')
      .from('message_threads')
      .insert({
        salon_id: validated.salon_id,
        customer_id: user.id,
        subject: validated.subject || null,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Send message using the actual database schema (from_user_id, to_user_id)
    // Note: messages doesn't have a public view yet, keeping .schema() for now
    const { data, error } = await supabase
      .schema('communication')
      .from('messages')
      .insert({
        from_user_id: user.id,
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

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to send message' }
  }
}

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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Mark all messages from the specified user to current user as read
    // Note: messages doesn't have a public view yet, keeping .schema() for now
    const { error } = await supabase
      .schema('communication')
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('from_user_id', fromUserId)
      .eq('to_user_id', user.id)
      .eq('is_read', false)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages')

    return { success: true, error: null }
  } catch (error) {
    return { error: 'Failed to mark messages as read' }
  }
}
