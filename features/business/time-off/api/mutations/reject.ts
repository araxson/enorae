'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { rejectTimeOffSchema } from '../schemas'

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
} | null

/**
 * Reject a time-off request
 * SECURITY: Business users only, salon ownership verified
 * AUDIT: Logs rejection with reviewer and reason
 */
export async function rejectTimeOffRequestAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const logger = createOperationLogger('rejectTimeOffRequestAction', {})
  logger.start()

  try {
    // Validate with Zod
    const parsed = rejectTimeOffSchema.safeParse({
      requestId: formData.get('requestId'),
      rejectionReason: formData.get('rejectionReason'),
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const validated = parsed.data

    // Authentication & Authorization
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    // Verify request belongs to a salon the user can access
    const { data: request, error: fetchError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('salon_id, status')
      .eq('id', validated.requestId)
      .single<{ salon_id: string | null; status: string | null }>()

    if (fetchError || !request) {
      return { error: 'Time-off request not found' }
    }

    if (!request.salon_id || !(await canAccessSalon(request.salon_id))) {
      return { error: 'Unauthorized: Request not in your salon' }
    }

    // Check if request is already processed
    if (request.status !== 'pending') {
      return { error: `Request is already ${request.status}` }
    }

    // Update request
    const { error } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .update({
        status: 'rejected',
        reviewed_by_id: session.user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: validated.rejectionReason,
        updated_by_id: session.user.id,
      })
      .eq('id', validated.requestId)
      .eq('salon_id', request.salon_id)

    if (error) {
      logger.error(new Error(error.message), 'database')
      return { error: 'Failed to reject request. Please try again.' }
    }

    revalidatePath('/business/time-off', 'page')

    return {
      message: 'Time-off request rejected',
      success: true,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error(String(error))
    logger.error(errorMessage, 'system')
    return {
      error: error instanceof Error ? error.message : 'Failed to reject request',
    }
  }
}
