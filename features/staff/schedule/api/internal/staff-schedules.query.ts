import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/features/staff/clients/api/internal/auth'
import type { StaffScheduleWithStaff, StaffSchedule, Staff } from './types'

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
    .from('staff_schedules_view')
    .select('*')
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

  const schedules = (data || []) as StaffSchedule[]
  const staffIds = Array.from(
    new Set(
      schedules
        .map((schedule) => schedule.staff_id)
        .filter((id): id is string => Boolean(id)),
    ),
  )

  let staffMap = new Map<string, Staff>()
  if (staffIds.length > 0) {
    const { data: staffRows, error: staffError } = await supabase
      .from('staff_profiles_view')
      .select('*')
      .in('id', staffIds)

    if (staffError) throw staffError

    staffMap = new Map(
      (staffRows || [])
        .filter((staff): staff is Staff => Boolean(staff?.id))
        .map((staff) => [staff.id as string, staff as Staff]),
    )
  }

  return schedules.map((schedule) => ({
    ...schedule,
    staff: schedule.staff_id ? staffMap.get(schedule.staff_id) ?? null : null,
  }))
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffMemberSchedule(staffId: string, startDate?: string, endDate?: string): Promise<StaffSchedule[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase } = await verifyStaffOwnership(staffId)

  const query = supabase
    .from('staff_schedules_view')
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
