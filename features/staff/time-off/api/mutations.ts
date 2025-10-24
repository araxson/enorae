'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { z } from 'zod'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const requestSchema = z.object({
  staffId: z.string().regex(UUID_REGEX),
  startAt: z.string(),
  endAt: z.string(),
  requestType: z.enum(['vacation', 'sick_leave', 'personal', 'other']),
  reason: z.string().optional(),
  isAutoReschedule: z.boolean().optional(),
  isNotifyCustomers: z.boolean().optional(),
})

type TimeOffRequestInsert = Database['scheduling']['Tables']['time_off_requests']['Insert']
type TimeOffRequestUpdate = Database['scheduling']['Tables']['time_off_requests']['Update']

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
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const insertPayload: TimeOffRequestInsert = {
      salon_id: staffProfile.salon_id,
      staff_id: data.staffId,
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
    }

    const { error: insertError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .insert<TimeOffRequestInsert>(insertPayload)

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create request' }
  }
}

export async function approveTimeOffRequest(formData: FormData) {
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

    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to reject' }
  }
}

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
      .from('time_off_requests')
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
