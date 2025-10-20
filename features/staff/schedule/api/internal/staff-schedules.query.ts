import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/features/staff/clients/api/internal/auth'
import type { StaffScheduleWithStaff, StaffSchedule } from './types'

/**
 * Get all staff schedules for a salon
 */
export async function getStaffSchedules(salonId: string, startDate?: string, endDate?: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership()
  if (!staffProfile.salon_id || staffProfile.salon_id !== salonId) {
    throw new Error('Unauthorized')
  }

  const query = supabase
    .from('staff_schedules')
    .select(`
      *,
      staff:staff_id(*)
    `)
    .eq('salon_id', salonId)
    .order('work_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (startDate) {
    query.gte('work_date', startDate)
  }

  if (endDate) {
    query.lte('work_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StaffScheduleWithStaff[]
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffMemberSchedule(staffId: string, startDate?: string, endDate?: string): Promise<StaffSchedule[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase } = await verifyStaffOwnership(staffId)

  const query = supabase
    .from('staff_schedules')
    .select('*')
    .eq('staff_id', staffId)
    .order('work_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (startDate) {
    query.gte('work_date', startDate)
  }

  if (endDate) {
    query.lte('work_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}
