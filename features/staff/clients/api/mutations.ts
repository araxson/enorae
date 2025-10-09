'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const messageClientSchema = z.object({
  customerId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  subject: z.string().max(200).optional(),
})

const clientNoteSchema = z.object({
  customerId: z.string().uuid(),
  note: z.string().min(1).max(1000),
})

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Send a message to a client
 * Creates or uses existing thread
 */
export async function messageClient(
  data: z.infer<typeof messageClientSchema>
): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const validation = messageClientSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message }
    }

    const { customerId, message, subject } = validation.data

    // Get staff profile
    const { data: staff } = await supabase
      .from('staff')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .single<{ id: string; salon_id: string }>()

    if (!staff?.id) {
      return { success: false, error: 'Staff profile not found' }
    }

    // Find or create thread
    let threadId: string

    const { data: existingThread } = await supabase
      .from('message_threads')
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
        .from('message_threads')
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
      .from('messages')
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
      .from('message_threads')
      .select('unread_count_customer')
      .eq('id', threadId)
      .single<{ unread_count_customer: number }>()

    await supabase
      .schema('communication')
      .from('message_threads')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_by_id: session.user.id,
        unread_count_customer: (currentThread?.unread_count_customer || 0) + 1,
      })
      .eq('id', threadId)

    revalidatePath('/staff/clients')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error messaging client:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}

/**
 * Add a private note about a client
 * Notes are stored in thread metadata and only visible to staff
 */
export async function addClientNote(
  data: z.infer<typeof clientNoteSchema>
): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const validation = clientNoteSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message }
    }

    const { customerId, note } = validation.data

    // Get staff profile
    const { data: staff } = await supabase
      .from('staff')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .single<{ id: string; salon_id: string }>()

    if (!staff?.id) {
      return { success: false, error: 'Staff profile not found' }
    }

    // Find or create thread for notes storage
    let threadId: string

    const { data: existingThread } = await supabase
      .from('message_threads')
      .select('id, metadata')
      .eq('salon_id', staff.salon_id)
      .eq('customer_id', customerId)
      .eq('staff_id', staff.id)
      .single<{ id: string; metadata: any }>()

    if (existingThread?.id) {
      threadId = existingThread.id

      // Append note to metadata
      const currentNotes = existingThread.metadata?.notes || []
      const updatedNotes = [
        ...currentNotes,
        {
          id: crypto.randomUUID(),
          content: note,
          created_by: session.user.id,
          created_at: new Date().toISOString(),
        },
      ]

      const { error } = await supabase
        .schema('communication')
        .from('message_threads')
        .update({
          metadata: { ...existingThread.metadata, notes: updatedNotes },
          updated_at: new Date().toISOString(),
        })
        .eq('id', threadId)

      if (error) throw error
    } else {
      // Create new thread with note
      const { error: threadError } = await supabase
        .schema('communication')
        .from('message_threads')
        .insert({
          salon_id: staff.salon_id,
          customer_id: customerId,
          staff_id: staff.id,
          subject: 'Client Notes',
          status: 'open',
          priority: 'normal',
          metadata: {
            notes: [
              {
                id: crypto.randomUUID(),
                content: note,
                created_by: session.user.id,
                created_at: new Date().toISOString(),
              },
            ],
          },
        })

      if (threadError) throw threadError
    }

    revalidatePath('/staff/clients')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error adding client note:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add note',
    }
  }
}

/**
 * Update client preferences (allergies, preferred services, etc.)
 * Stored in thread metadata for staff reference
 */
export async function updateClientPreferences(
  customerId: string,
  preferences: {
    allergies?: string[]
    preferred_services?: string[]
    notes?: string
  }
): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Get staff profile
    const { data: staff } = await supabase
      .from('staff')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .single<{ id: string; salon_id: string }>()

    if (!staff?.id) {
      return { success: false, error: 'Staff profile not found' }
    }

    // Find or create thread
    const { data: existingThread } = await supabase
      .from('message_threads')
      .select('id, metadata')
      .eq('salon_id', staff.salon_id)
      .eq('customer_id', customerId)
      .eq('staff_id', staff.id)
      .single<{ id: string; metadata: any }>()

    const updatedMetadata = {
      ...(existingThread?.metadata || {}),
      preferences: {
        ...preferences,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      },
    }

    if (existingThread?.id) {
      // Update existing thread
      const { error } = await supabase
        .schema('communication')
        .from('message_threads')
        .update({
          metadata: updatedMetadata,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingThread.id)

      if (error) throw error
    } else {
      // Create new thread
      const { error: threadError } = await supabase
        .schema('communication')
        .from('message_threads')
        .insert({
          salon_id: staff.salon_id,
          customer_id: customerId,
          staff_id: staff.id,
          subject: 'Client Preferences',
          status: 'open',
          priority: 'normal',
          metadata: updatedMetadata,
        })

      if (threadError) throw threadError
    }

    revalidatePath(`/staff/clients/${customerId}`)
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating client preferences:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update preferences',
    }
  }
}
