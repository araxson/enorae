'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canAccessSalon } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { createStaffFormSchema } from './action-schemas'
import type { FormState } from './action-types'

export async function createStaffAction(
  salonId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('createStaffAction', { salonId })
  logger.start()

  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        message: 'You must be logged in to create staff',
        success: false,
      }
    }

    // Check salon access
    if (!(await canAccessSalon(salonId))) {
      logger.error('Unauthorized access attempt', 'permission', { userId: user.id })
      return {
        message: 'Unauthorized: You do not have access to this salon',
        success: false,
      }
    }

    // Parse and validate form data
    const parsed = createStaffFormSchema.safeParse({
      email: formData.get('email'),
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

    // Check if email already exists for this salon
    const { data: existingStaff } = await supabase
      .from('staff')
      .select('id')
      .eq('salon_id', salonId)
      .eq('email', data.email)
      .maybeSingle()

    if (existingStaff) {
      return {
        message: 'A staff member with this email already exists',
        errors: {
          email: ['This email is already in use'],
        },
        success: false,
      }
    }

    // Insert staff member
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .insert({
        salon_id: salonId,
        email: data.email,
        full_name: data.full_name,
        title: data.title ?? null,
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        experience_years: data.experience_years ?? null,
        is_active: true,
        created_by_id: user.id,
        updated_by_id: user.id,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select('id')
      .single()

    if (staffError || !staff) {
      logger.error('Staff insert failed', 'database', { error: staffError })
      return {
        message: staffError?.message || 'Failed to create staff member',
        success: false,
      }
    }

    logger.success({
      staffId: staff.id,
      staffName: data.full_name,
    })

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
