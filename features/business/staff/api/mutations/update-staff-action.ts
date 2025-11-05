'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canAccessSalon } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { updateStaffFormSchema } from './action-schemas'
import type { FormState } from './action-types'

/**
 * Update staff Server Action
 */
export async function updateStaffAction(
  staffId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('updateStaffAction', { staffId })
  logger.start()

  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        message: 'You must be logged in to update staff',
        success: false,
      }
    }

    // Get staff to check access
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('id', staffId)
      .single()

    if (staffError || !staff) {
      return {
        message: 'Staff member not found',
        success: false,
      }
    }

    // Check salon access
    if (!(await canAccessSalon(staff.salon_id))) {
      logger.error('Unauthorized access attempt', 'permission', { userId: user.id })
      return {
        message: 'Unauthorized: You do not have access to this salon',
        success: false,
      }
    }

    // Parse and validate form data
    const parsed = updateStaffFormSchema.safeParse({
      full_name: formData.get('full_name'),
      title: formData.get('title'),
      bio: formData.get('bio'),
      phone: formData.get('phone'),
      experience_years: formData.get('experience_years'),
    })

    if (!parsed.success) {
      logger.error('Validation failed', 'validation', {
        errors: parsed.error.flatten().fieldErrors,
      })
      return {
        message: 'Please fix the errors below',
        errors: parsed.error.flatten().fieldErrors,
        success: false,
      }
    }

    const data = parsed.data
    const timestamp = new Date().toISOString()

    // Update staff member
    const { error: updateError } = await supabase
      .from('staff')
      .update({
        full_name: data.full_name,
        title: data.title ?? null,
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        experience_years: data.experience_years ?? null,
        updated_by_id: user.id,
        updated_at: timestamp,
      })
      .eq('id', staffId)

    if (updateError) {
      logger.error('Staff update failed', 'database', { error: updateError })
      return {
        message: updateError.message || 'Failed to update staff member',
        success: false,
      }
    }

    logger.success({ staffName: data.full_name })

    // Revalidate and redirect
    revalidatePath('/business/staff')
    redirect('/business/staff')
  } catch (error) {
    logger.error('Unexpected error', 'system', { error })
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false,
    }
  }
}

