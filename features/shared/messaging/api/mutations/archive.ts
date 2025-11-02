'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { UUID_REGEX } from './schemas'
import { createOperationLogger } from '@/lib/observability/logger'

/**
 * Archive a message thread
 */
export async function archiveThread(threadId: string) {
  const logger = createOperationLogger('archiveThread', {})
  logger.start()

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
      })
      .eq('id', threadId)
      .eq('customer_id', session.user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/customer/messages', 'page')
    revalidatePath('/business/messages', 'page')

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to archive thread' }
  }
}
