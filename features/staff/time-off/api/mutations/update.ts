'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { UUID_REGEX } from './schemas'

type TimeOffRequestUpdate = Database['scheduling']['Tables']['time_off_requests']['Update']

/**
 * Update time-off request (staff can only edit pending requests)
 */
export async function updateTimeOffRequest(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const startAt = formData.get('startAt')?.toString()
    const endAt = formData.get('endAt')?.toString()
    const reason = formData.get('reason')?.toString()
    const requestType = formData.get('requestType')?.toString()

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Get staff profile
    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('id, salon_id')
      .eq('user_id', user.id)
      .single<{ id: string; salon_id: string | null }>()

    if (!staffProfile?.id) return { error: 'Staff profile not found' }

    // Verify ownership and status - staff can only edit their own pending requests
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling').from('time_off_requests')
      .select('staff_id, staff_user_id, status')
      .eq('id', id)
      .single<{ staff_id: string; staff_user_id: string | null; status: string }>()

    if (fetchError || !request) return { error: 'Request not found' }

    if (request.staff_user_id !== user.id) {
      return { error: 'Unauthorized: Can only edit your own requests' }
    }

    if (request.status !== 'pending') {
      return { error: 'Can only edit pending requests' }
    }

    // Build update object
    const updateData: TimeOffRequestUpdate = {
      updated_at: new Date().toISOString(),
      updated_by_id: user.id,
    }

    if (startAt) updateData.start_at = startAt
    if (endAt) updateData.end_at = endAt
    if (reason !== undefined) updateData.reason = reason || null
    if (requestType) {
      if (!['vacation', 'sick_leave', 'personal', 'other'].includes(requestType)) {
        return { error: 'Invalid request type' }
      }
      updateData.request_type = requestType
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .schema('scheduling').from('time_off_requests')
      .update<TimeOffRequestUpdate>(updateData)
      .eq('id', id)
      .eq('staff_id', staffProfile.id) // Security check

    if (updateError) return { error: updateError.message }

    revalidatePath('/staff/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update request' }
  }
}
