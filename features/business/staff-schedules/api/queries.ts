import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']

export type StaffScheduleWithDetails = StaffSchedule & {
  staff_name?: string | null
  staff_title?: string | null
}

/**
 * Get all staff schedules for the salon
 */
export async function getStaffSchedules(): Promise<StaffScheduleWithDetails[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*, staff:staff_id(full_name, title)')
    .eq('salon_id', salonId)
    .order('staff_id')
    .order('day_of_week')

  if (error) throw error

  return (data || []).map((schedule: StaffSchedule & { staff: { full_name: string | null; title: string | null } | null }) => ({
    ...schedule,
    staff_name: schedule.staff?.full_name || null,
    staff_title: schedule.staff?.title || null,
  })) as StaffScheduleWithDetails[]
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffSchedulesByStaffId(
  staffId: string
): Promise<StaffScheduleWithDetails[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*, staff:staff_id(full_name, title)')
    .eq('staff_id', staffId)
    .eq('salon_id', salonId)
    .order('day_of_week')

  if (error) throw error

  return (data || []).map((schedule: StaffSchedule & { staff: { full_name: string | null; title: string | null } | null }) => ({
    ...schedule,
    staff_name: schedule.staff?.full_name || null,
    staff_title: schedule.staff?.title || null,
  })) as StaffScheduleWithDetails[]
}

/**
 * Get all staff members for schedule management
 */
export async function getStaffForScheduling(): Promise<
  Array<{ id: string; full_name: string | null; title: string | null }>
> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id, full_name, title')
    .eq('salon_id', salonId)
    .order('full_name')

  if (error) throw error
  return data || []
}
