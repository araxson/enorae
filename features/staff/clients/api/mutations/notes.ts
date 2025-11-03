'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import type { ActionResponse, ThreadMetadata } from '../../api/types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import { STRING_LIMITS } from '@/lib/config/constants'

const clientNoteSchema = z.object({
  customerId: z.string().uuid(),
  note: z.string().min(1).max(STRING_LIMITS.DESCRIPTION),
})

/**
 * Add a private note about a client
 * Notes are stored in thread metadata and only visible to staff
 */
export async function addClientNote(
  data: z.infer<typeof clientNoteSchema>
): Promise<ActionResponse> {
  const logger = createOperationLogger('addClientNote', {})
  logger.start()

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const validation = clientNoteSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || "Validation failed" }
    }

    const { customerId, note } = validation.data

    // Get staff profile
    const { data: staff } = await supabase
      .from('staff_profiles_view')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .single<{ id: string; salon_id: string }>()

    if (!staff?.id) {
      return { success: false, error: 'Staff profile not found' }
    }

    // Find or create thread for notes storage
    let threadId: string

    const { data: existingThread } = await supabase
      .schema('communication').from('message_threads')
      .select('id, metadata')
      .eq('salon_id', staff.salon_id)
      .eq('customer_id', customerId)
      .eq('staff_id', staff.id)
      .single<{ id: string; metadata: ThreadMetadata | null }>()

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
        .schema('communication').from('message_threads')
        .update({
          metadata: { ...(existingThread.metadata ?? {}), notes: updatedNotes },
          updated_at: new Date().toISOString(),
        })
        .eq('id', threadId)

      if (error) throw error
    } else {
      // Create new thread with note
      const { error: threadError } = await supabase
        .schema('communication')
        .schema('communication').from('message_threads')
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

    revalidatePath('/staff/clients', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add note',
    }
  }
}
