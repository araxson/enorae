'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { UUID_REGEX } from './schemas'

export async function approveTimeOffRequest(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const session = await requireAnyRole(ROLE_GROUPS.SALON_MANAGERS)
    const supabase = await createClient()
    const userId = session.user.id

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', userId)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

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

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update({
        status: 'approved',
        reviewed_by_id: userId,
        reviewed_at: new Date().toISOString(),
        updated_by_id: userId,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/time-off')
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

    const session = await requireAnyRole(ROLE_GROUPS.SALON_MANAGERS)
    const supabase = await createClient()
    const userId = session.user.id

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', userId)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

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

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update({
        status: 'rejected',
        review_notes: notes || null,
        reviewed_by_id: userId,
        reviewed_at: new Date().toISOString(),
        updated_by_id: userId,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to reject' }
  }
}
