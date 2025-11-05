'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { cancelTimeOffRequestSchema } from '../schemas'

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
} | null

/**
 * Cancel a pending time-off request
 * SECURITY: Staff users only, own requests only
 */
export async function cancelTimeOffRequestAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Validate with Zod
    const parsed = cancelTimeOffRequestSchema.safeParse({
      requestId: formData.get('requestId'),
      cancellationReason: formData.get('cancellationReason'),
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const validated = parsed.data

    // Authentication
    const session = await requireAnyRole(ROLE_GROUPS.STAFF_USERS)
    const supabase = await createClient()

    // Verify request belongs to user
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('staff_id, status')
      .eq('id', validated.requestId)
      .single<{ staff_id: string | null; status: string | null }>()

    if (fetchError || !request) {
      return { error: 'Request not found' }
    }

    if (request.staff_id !== session.user.id) {
      return { error: 'Unauthorized: Not your request' }
    }

    // Can only cancel pending or approved requests
    if (request.status !== 'pending' && request.status !== 'approved') {
      return { error: `Cannot cancel ${request.status} request` }
    }

    // Update request to cancelled
    const { error } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update({
        status: 'cancelled',
        review_notes: validated.cancellationReason,
        updated_by_id: session.user.id,
      })
      .eq('id', validated.requestId)

    if (error) {
      return { error: 'Failed to cancel request' }
    }

    revalidatePath('/staff/time-off', 'page')

    return {
      message: 'Time-off request cancelled',
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to cancel request',
    }
  }
}
