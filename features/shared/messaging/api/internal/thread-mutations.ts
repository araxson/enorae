'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import type { Database } from '@/lib/types/database.types'
import { createThreadSchema, UUID_REGEX } from './schemas'

/**
 * Create a new message thread
 */
export async function createThread(input: z.infer<typeof createThreadSchema>): Promise<{ data?: Database['communication']['Tables']['message_threads']['Row']; error: string | null }> {
  try {
    // Validate input
    const validated = createThreadSchema.parse(input)

    const supabase = await createClient()

    // Auth check
    // SECURITY: Require authentication
    const session = await requireAuth()

    // Verify salon exists
    const { data: salon, error: salonError } = await supabase
      .from('salons')
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
 * Archive a message thread
 */
export async function archiveThread(threadId: string): Promise<{ success?: boolean; error: string | null }> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(threadId)) {
      return { error: 'Invalid thread ID' }
    }

    const supabase = await createClient()
    const session = await requireAuth()

    // Update thread status to archived
    const { error } = await supabase
      .schema('communication')
      .from('message_threads')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', threadId)
      .or(`customer_id.eq.${session.user.id},salon_id.in.(select id from organization.salons where owner_id = ${session.user.id})`)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to archive thread' }
  }
}

/**
 * Mark a thread as unread
 */
export async function markThreadAsUnread(threadId: string): Promise<{ success?: boolean; error: string | null }> {
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

    revalidatePath('/customer/messages')
    revalidatePath('/business/messages')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to mark thread as unread' }
  }
}
