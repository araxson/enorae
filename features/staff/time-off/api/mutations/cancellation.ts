'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { UUID_REGEX } from './schemas'

type TimeOffRequestUpdate = Database['scheduling']['Tables']['time_off_requests']['Update']

/**
 * Cancel time-off request (staff can cancel pending or approved requests)
 */
export async function cancelTimeOffRequest(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Get staff profile
    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('id')
      .eq('user_id', user.id)
      .single<{ id: string }>()

    if (!staffProfile?.id) return { error: 'Staff profile not found' }

    // Verify ownership and status
    const { data: request, error: fetchError } = await supabase
      .from('time_off_requests')
      .select('staff_id, staff_user_id, status')
      .eq('id', id)
      .single<{ staff_id: string; staff_user_id: string | null; status: string }>()

    if (fetchError || !request) return { error: 'Request not found' }

    if (request.staff_user_id !== user.id) {
      return { error: 'Unauthorized: Can only cancel your own requests' }
    }

    // Cannot cancel already rejected or cancelled requests
    if (request.status === 'rejected' || request.status === 'cancelled') {
      return { error: `Request is already ${request.status}` }
    }

    const cancelPayload: TimeOffRequestUpdate = {
      status: 'cancelled',
      updated_at: new Date().toISOString(),
      updated_by_id: user.id,
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update<TimeOffRequestUpdate>(cancelPayload)
      .eq('id', id)
      .eq('staff_id', staffProfile.id) // Security check

    if (updateError) return { error: updateError.message }

    revalidatePath('/staff/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to cancel request' }
  }
}
