'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { createTimeOffRequestSchema } from '../schemas'

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
} | null

/**
 * Create a new time-off request (staff portal)
 * SECURITY: Staff users only
 * VALIDATION: Date range, duration limits, reason required
 */
export async function createTimeOffRequestAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const logger = createOperationLogger('createTimeOffRequestAction', {})
  logger.start()

  try {
    // Validate with Zod
    const parsed = createTimeOffRequestSchema.safeParse({
      salon_id: formData.get('salon_id'),
      staff_id: formData.get('staff_id'),
      request_type: formData.get('request_type'),
      start_at: formData.get('start_at'),
      end_at: formData.get('end_at'),
      reason: formData.get('reason'),
      notes: formData.get('notes') || undefined,
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const validated = parsed.data

    // Authentication & Authorization
    const session = await requireAnyRole(ROLE_GROUPS.STAFF_USERS)
    const supabase = await createClient()

    // Verify staff ID matches authenticated user
    if (validated.staff_id !== session.user.id) {
      return { error: 'Unauthorized: Cannot create request for another staff member' }
    }

    // Verify staff has access to salon
    if (!(await canAccessSalon(validated.salon_id))) {
      return { error: 'Unauthorized: You do not belong to this salon' }
    }

    // Check for overlapping time-off requests
    const { data: overlapping } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .select('id')
      .eq('staff_id', validated.staff_id)
      .eq('salon_id', validated.salon_id)
      .in('status', ['pending', 'approved'])
      .or(
        `and(start_at.lte.${validated.end_at},end_at.gte.${validated.start_at})`
      )
      .limit(1)
      .maybeSingle()

    if (overlapping) {
      return {
        error: 'You already have a time-off request for this period',
      }
    }

    // Create request
    const { error } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .insert({
        salon_id: validated.salon_id,
        staff_id: validated.staff_id,
        request_type: validated.request_type,
        start_at: validated.start_at,
        end_at: validated.end_at,
        reason: validated.reason,
        status: 'pending',
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (error) {
      logger.error(new Error(error.message), 'database')
      return { error: 'Failed to create request. Please try again.' }
    }

    revalidatePath('/staff/time-off', 'page')

    return {
      message: 'Time-off request submitted successfully',
      success: true,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error(String(error))
    logger.error(errorMessage, 'system')
    return {
      error: error instanceof Error ? error.message : 'Failed to create request',
    }
  }
}
