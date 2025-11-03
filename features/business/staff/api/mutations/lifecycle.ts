'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logError } from '@/lib/observability'

/**
 * Deactivate a staff member (soft delete)
 */
export async function deactivateStaffMember(staffId: string) {
  const logger = createOperationLogger('deactivateStaffMember', { staffId })

  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    logger.start({ staffId, salonId, userId: session.user.id })

    // Verify staff belongs to user's salon
    const { data: staff, error: verifyError } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('id', staffId)
      .maybeSingle<{ salon_id: string | null }>()

    if (verifyError) {
      logger.error(verifyError, 'database', { staffId, salonId, userId: session.user.id })
      throw verifyError
    }

    if (!staff || staff['salon_id'] !== salonId) {
      logger.error('Unauthorized deactivation attempt', 'permission', { staffId, salonId, staffSalonId: staff?.salon_id, userId: session.user.id })
      throw new Error('Unauthorized')
    }

    const { error } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', staffId)

    if (error) {
      logger.error(error, 'database', { staffId, salonId, userId: session.user.id })
      throw error
    }

    logger.success({ staffId, salonId, userId: session.user.id })
    revalidatePath('/business/staff', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { staffId })
    throw error
  }
}

/**
 * Reactivate a staff member
 */
export async function reactivateStaffMember(staffId: string) {
  const logger = createOperationLogger('reactivateStaffMember', { staffId })

  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    logger.start({ staffId, salonId, userId: session.user.id })

    // Verify staff belongs to user's salon
    const { data: staff, error: verifyError } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('id', staffId)
      .maybeSingle<{ salon_id: string | null }>()

    if (verifyError) {
      logger.error(verifyError, 'database', { staffId, salonId, userId: session.user.id })
      throw verifyError
    }

    if (!staff || staff['salon_id'] !== salonId) {
      logger.error('Unauthorized reactivation attempt', 'permission', { staffId, salonId, staffSalonId: staff?.salon_id, userId: session.user.id })
      throw new Error('Unauthorized')
    }

    const { error } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .update({
        deleted_at: null,
      })
      .eq('id', staffId)

    if (error) {
      logger.error(error, 'database', { staffId, salonId, userId: session.user.id })
      throw error
    }

    logger.success({ staffId, salonId, userId: session.user.id })
    revalidatePath('/business/staff', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { staffId })
    throw error
  }
}
