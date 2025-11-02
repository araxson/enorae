'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { updateStaffSchema } from '../schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import type { StaffFormData } from './create'

/**
 * Update an existing staff member
 *
 * Security: Validates all inputs with Zod schema before processing
 */
export async function updateStaffMember(staffId: string, data: Partial<StaffFormData>) {
  const logger = createOperationLogger('updateStaffMember', { staffId })

  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    logger.start({ staffId, salonId, userId: session.user.id })

    // Validate input with Zod schema
    const validation = updateStaffSchema.safeParse(data)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Validation failed', 'validation', { staffId, salonId })
      throw new Error(firstError?.message ?? 'Validation failed')
    }

    const validatedData = validation.data
    const supabase = await createClient()

    // Verify staff belongs to user's salon
    const { data: staff, error: verifyError } = await supabase
      .from('staff_profiles_view')
      .select('salon_id, user_id')
      .eq('id', staffId)
      .maybeSingle<{ salon_id: string | null; user_id: string | null }>()

    if (verifyError) {
      logger.error(verifyError, 'database', { staffId, salonId, userId: session.user.id })
      throw verifyError
    }
    if (!staff || staff['salon_id'] !== salonId) {
      logger.error('Unauthorized staff access attempt', 'permission', { staffId, salonId, staffSalonId: staff?.salon_id, userId: session.user.id })
      throw new Error('Unauthorized: Staff does not belong to your salon')
    }

    // Update staff profile
    const staffUpdate: Record<string, unknown> = {}
    if (validatedData.title !== undefined) staffUpdate['title'] = validatedData.title
    if (validatedData.bio !== undefined) staffUpdate['bio'] = validatedData.bio
    if (validatedData.experience_years !== undefined) staffUpdate['experience_years'] = validatedData.experience_years

    if (Object.keys(staffUpdate).length > 0) {
      const { error } = await supabase
        .schema('organization')
        .from('staff_profiles')
        .update(staffUpdate)
        .eq('id', staffId)

      if (error) {
        logger.error(error, 'database', { staffId, salonId, userId: session.user.id })
        throw error
      }
    }

    // Update profile metadata if name provided
    if (validatedData.full_name && staff['user_id']) {
      const { error: metadataError } = await supabase
        .schema('identity')
        .from('profiles_metadata')
        .upsert({
          profile_id: staff['user_id'],
          full_name: validatedData.full_name,
          updated_at: new Date().toISOString(),
        })

      if (metadataError) {
        logger.error(metadataError, 'database', { staffId, salonId, userId: session.user.id, profileId: staff['user_id'] })
        throw metadataError
      }
    }

    logMutation('update', 'staff_member', staffId, {
      salonId,
      userId: session.user.id,
      operationName: 'updateStaffMember',
      changes: staffUpdate,
    })

    logger.success({ staffId, salonId, userId: session.user.id })
    revalidatePath('/business/staff', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { staffId })
    throw error
  }
}
