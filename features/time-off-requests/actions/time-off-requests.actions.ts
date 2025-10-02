'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: time_off_requests and staff_profiles don't have public views yet
// Keeping .schema() calls until public views are created for scheduling tables

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
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const { error: insertError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .insert({
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
      })

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
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // SECURITY: Verify the time-off request belongs to user's salon
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('salon_id')
      .eq('id', id)
      .single()

    if (fetchError || !request) return { error: 'Request not found' }
    if (request.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Request not found for your salon' }
    }

    const { error: updateError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update({
        status: 'approved',
        reviewed_by_id: user.id,
        reviewed_at: new Date().toISOString(),
        updated_by_id: user.id,
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

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // SECURITY: Get user's salon_id
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // SECURITY: Verify the time-off request belongs to user's salon
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('salon_id')
      .eq('id', id)
      .single()

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
        reviewed_by_id: user.id,
        reviewed_at: new Date().toISOString(),
        updated_by_id: user.id,
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
