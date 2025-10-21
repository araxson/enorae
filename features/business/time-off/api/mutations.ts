'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type ActionResult = {
  success?: boolean
  error?: string
}

/**
 * Approve a time-off request
 * SECURITY: Business users only, salon ownership verified
 */
export async function approveTimeOffRequest(requestId: string, notes?: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(requestId)) {
      return { error: 'Invalid request ID' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    await requireUserSalonId()

    const supabase = await createClient()

    // Verify request belongs to a salon the user can access
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests_view')
      .select('salon_id')
      .eq('id', requestId)
      .single<{ salon_id: string | null }>()

    if (fetchError || !request) {
      return { error: 'Request not found' }
    }

    if (!request.salon_id || !(await canAccessSalon(request.salon_id))) {
      return { error: 'Unauthorized: Request not in your salon' }
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('time_off_requests_view')
      .update({
        status: 'approved',
        reviewed_by_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: notes || null,
        updated_by_id: session.user.id,
      })
      .eq('id', requestId)
      .eq('salon_id', request.salon_id)

    if (error) throw error

    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to approve request' }
  }
}

/**
 * Reject a time-off request
 * SECURITY: Business users only, salon ownership verified
 */
export async function rejectTimeOffRequest(requestId: string, notes: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(requestId)) {
      return { error: 'Invalid request ID' }
    }

    if (!notes || notes.trim().length === 0) {
      return { error: 'Rejection reason is required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    await requireUserSalonId()

    const supabase = await createClient()

    // Verify request belongs to a salon the user can access
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests_view')
      .select('salon_id')
      .eq('id', requestId)
      .single<{ salon_id: string | null }>()

    if (fetchError || !request) {
      return { error: 'Request not found' }
    }

    if (!request.salon_id || !(await canAccessSalon(request.salon_id))) {
      return { error: 'Unauthorized: Request not in your salon' }
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('time_off_requests_view')
      .update({
        status: 'rejected',
        reviewed_by_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: notes,
        updated_by_id: session.user.id,
      })
      .eq('id', requestId)
      .eq('salon_id', request.salon_id)

    if (error) throw error

    revalidatePath('/business/time-off')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to reject request' }
  }
}
