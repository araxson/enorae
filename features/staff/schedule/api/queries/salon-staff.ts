import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import type { Staff } from '../types'
import { createOperationLogger } from '@/lib/observability/logger'

/**
 * Get all staff members for a salon
 */
export async function getSalonStaff(salonId: string) {
  const logger = createOperationLogger('getSalonStaff', {})
  logger.start()

  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership()
  if (!staffProfile.salon_id || staffProfile.salon_id !== salonId) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('full_name')

  if (error) throw error
  return data as Staff[]
}

/**
 * Get all staff for shift swap options
 */
export async function getAvailableStaffForSwap(salonId: string, excludeStaffId: string) {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership(excludeStaffId)
  if (!staffProfile.salon_id || staffProfile.salon_id !== salonId) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id, full_name, title, user_id')
    .eq('salon_id', salonId)
    .neq('id', excludeStaffId)
    .order('full_name')

  if (error) throw error
  return data || []
}

/**
 * Get salon for current user (for staff schedule)
 */
export async function getScheduleSalon() {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)
  const { staffProfile } = await verifyStaffOwnership()
  if (!staffProfile.salon_id) {
    throw new Error('No salon found for your account')
  }
  return { id: staffProfile.salon_id }
}
