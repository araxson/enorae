'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { UUID_REGEX } from './schemas'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

type TimeOffRequestUpdate = Database['scheduling']['Tables']['time_off_requests']['Update']

export async function approveTimeOffRequest(formData: FormData) {
  const logger = createOperationLogger('approveTimeOffRequest', {})
  logger.start()

  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // SECURITY: Get user's salon_id
    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // SECURITY: Verify the time-off request belongs to user's salon
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (fetchError || !request) return { error: 'Request not found' }
    if (request.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Request not found for your salon' }
    }

    const approvePayload: TimeOffRequestUpdate = {
      status: 'approved',
      reviewed_by_id: user.id,
      reviewed_at: new Date().toISOString(),
      updated_by_id: user.id,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update<TimeOffRequestUpdate>(approvePayload)
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/time-off', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to approve' }
  }
}

export async function rejectTimeOffRequest(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    const notes = formData.get('notes')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // SECURITY: Get user's salon_id
    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // SECURITY: Verify the time-off request belongs to user's salon
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (fetchError || !request) return { error: 'Request not found' }
    if (request.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Request not found for your salon' }
    }

    const rejectPayload: TimeOffRequestUpdate = {
      status: 'rejected',
      review_notes: notes || null,
      reviewed_by_id: user.id,
      reviewed_at: new Date().toISOString(),
      updated_by_id: user.id,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update<TimeOffRequestUpdate>(rejectPayload)
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/time-off', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to reject' }
  }
}
