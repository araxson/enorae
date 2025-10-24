'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { requestSchema, UUID_REGEX } from './schemas'

export async function createTimeOffRequest(formData: FormData) {
  try {
    const result = requestSchema.safeParse({
      staffId: formData.get('staffId'),
      startAt: formData.get('startAt'),
      endAt: formData.get('endAt'),
      requestType: formData.get('requestType'),
      reason: formData.get('reason'),
      isAutoReschedule: formData.get('isAutoReschedule') === 'true',
      isNotifyCustomers: formData.get('isNotifyCustomers') === 'true',
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('id, salon_id')
      .eq('user_id', user.id)
      .single<{ id: string; salon_id: string | null }>()

    if (!staffProfile?.id) return { error: 'Staff profile not found' }
    if (!staffProfile.salon_id) return { error: 'User salon not found' }

    if (staffProfile.id !== data.staffId) {
      return { error: 'Unauthorized: Can only submit your own requests' }
    }

    const { error: insertError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .insert({
        salon_id: staffProfile.salon_id,
        staff_id: staffProfile.id,
        start_at: data.startAt,
        end_at: data.endAt,
        request_type: data.requestType,
        reason: data.reason || null,
        status: 'pending',
        is_auto_reschedule: data.isAutoReschedule || false,
        is_notify_customers: data.isNotifyCustomers || false,
        created_by_id: user.id,
        updated_by_id: user.id,
        updated_at: new Date().toISOString(),
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/staff/time-off')
    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create request' }
  }
}

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

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('id, salon_id')
      .eq('user_id', user.id)
      .single<{ id: string; salon_id: string | null }>()

    if (!staffProfile?.id) return { error: 'Staff profile not found' }

    const { data: request, error: fetchError } = await supabase
      .from('time_off_requests')
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

    const updateData: Database['scheduling']['Tables']['time_off_requests']['Update'] = {
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
      .from('time_off_requests')
      .update(updateData)
      .eq('id', id)
      .eq('staff_id', staffProfile.id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/staff/time-off')
    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update request' }
  }
}

export async function cancelTimeOffRequest(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('id')
      .eq('user_id', user.id)
      .single<{ id: string }>()

    if (!staffProfile?.id) return { error: 'Staff profile not found' }

    const { data: request, error: fetchError } = await supabase
      .from('time_off_requests')
      .select('staff_id, staff_user_id, status')
      .eq('id', id)
      .single<{ staff_id: string; staff_user_id: string | null; status: string }>()

    if (fetchError || !request) return { error: 'Request not found' }

    if (request.staff_user_id !== user.id) {
      return { error: 'Unauthorized: Can only cancel your own requests' }
    }

    if (request.status === 'rejected' || request.status === 'cancelled') {
      return { error: `Request is already ${request.status}` }
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('staff_id', staffProfile.id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/staff/time-off')
    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to cancel request' }
  }
}
