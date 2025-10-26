'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { ActionResponse, ThreadMetadata } from './types'
import type { Json } from '@/lib/types/database.types'

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
      .from('staff_profiles_view')
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
      .single<{ id: string; metadata: ThreadMetadata | null }>()

    const updatedMetadata: ThreadMetadata = {
      ...(existingThread?.metadata ?? {}),
      preferences: {
        ...preferences,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      },
    }

    // Convert to JSON-safe object for database storage
    const metadataForDb = structuredClone(updatedMetadata) as Json

    if (existingThread?.id) {
      // Update existing thread
      const { error } = await supabase
        .schema('communication')
        .from('message_threads')
        .update({
          metadata: metadataForDb,
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
          metadata: metadataForDb,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
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
