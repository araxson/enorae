import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StaffSchedule = Database['public']['Views']['staff_schedules_view']['Row']
type Staff = Database['public']['Views']['staff_profiles_view']['Row']

export type StaffScheduleWithStaff = StaffSchedule & {
  staff: Staff | null
}

/**
 * Get all staff schedules for a salon
 */
export async function getStaffSchedules(salonId: string, startDate?: string, endDate?: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

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
        .map((schedule) => schedule['staff_id'])
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
        .map((staff) => {
          const staffTyped = staff as Staff
          return [staffTyped['id'] as string, staffTyped] as const
        })
        .filter((entry): entry is readonly [string, Staff] => Boolean(entry[0])),
    )
  }

  return schedules.map((schedule) => ({
    ...schedule,
    staff: schedule['staff_id'] ? staffMap.get(schedule['staff_id']) ?? null : null,
  }))
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffMemberSchedule(staffId: string, startDate?: string, endDate?: string): Promise<StaffSchedule[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

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

/**
 * Get all staff members for a salon
 */
export async function getSalonStaff(salonId: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('full_name')

  if (error) throw error
  return data as Staff[]
}

/**
 * Check for schedule conflicts
 */
export async function checkScheduleConflict(
  staffId: string,
  workDate: string,
  startTime: string,
  endTime: string,
  excludeScheduleId?: string
) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

  let query = supabase
    .from('staff_schedules_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('work_date', workDate)
    .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`)

  if (excludeScheduleId) {
    query = query.neq('id', excludeScheduleId)
  }

  const { data, error } = await query

  if (error) throw error
  return (data?.length || 0) > 0
}

/**
 * Get salon for current user (for staff schedule)
 */
export async function getScheduleSalon() {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user['id'])
    .maybeSingle<{ salon_id: string | null }>()

  if (error || !data?.['salon_id']) {
    throw new Error('No salon found for your account')
  }

  return { id: data['salon_id'] }
}

/**
 * Get all staff for shift swap options
 */
export async function getAvailableStaffForSwap(salonId: string, excludeStaffId: string) {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id, full_name, title, user_id')
    .eq('salon_id', salonId)
    .neq('id', excludeStaffId)
    .order('full_name')

  if (error) throw error
  return data || []
}

export interface ScheduleConflict {
  has_conflict: boolean
  conflicting_schedules: StaffSchedule[]
  conflicting_appointments: {
    id: string
    start_time: string
    end_time: string
    customer_name: string | null
  }[]
}

/**
 * Get detailed schedule conflicts including appointments
 */
export async function getScheduleConflicts(
  staffId: string,
  workDate: string,
  startTime: string,
  endTime: string,
  excludeScheduleId?: string
): Promise<ScheduleConflict> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()

  // Check schedule conflicts
  let scheduleQuery = supabase
    .from('staff_schedules_view')
    .select('*')
    .eq('staff_id', staffId)
    .gte('effective_from', workDate)
    .or(`effective_until.is.null,effective_until.gte.${workDate}`)

  if (excludeScheduleId) {
    scheduleQuery = scheduleQuery.neq('id', excludeScheduleId)
  }

  const { data: schedules } = await scheduleQuery

  // Check appointment conflicts
  const { data: appointmentData } = await supabase
    .from('appointments_view')
    .select('id, start_time, end_time, customer_id')
    .eq('staff_id', staffId)
    .gte('start_time', `${workDate}T${startTime}`)
    .lte('start_time', `${workDate}T${endTime}`)
    .in('status', ['confirmed', 'pending'])

  // Map appointments with customer names (fetch separately if needed)
  const appointments = (appointmentData || []).map((appt: any) => ({
    id: appt.id,
    start_time: appt.start_time,
    end_time: appt.end_time,
    customer_name: null, // customer_name not available from appointments_view
  }))

  return {
    has_conflict: (schedules?.length || 0) > 0 || (appointmentData?.length || 0) > 0,
    conflicting_schedules: schedules || [],
    conflicting_appointments: appointments,
  }
}
