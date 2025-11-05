import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import type { StaffScheduleWithStaff, StaffSchedule, Staff, DayOfWeek } from '../../api/types'
import { createOperationLogger } from '@/lib/observability'
import type { Database } from '@/lib/types/database.types'

type StaffScheduleRow = Database['public']['Views']['staff_schedules_view']['Row']
type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']

/**
 * Get all staff schedules for a salon
 */
export async function getStaffSchedules(salonId: string, startDate?: string, endDate?: string) {
  const logger = createOperationLogger('getStaffSchedules', {})
  logger.start()

  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership()
  if (!staffProfile.salon_id || staffProfile.salon_id !== salonId) {
    throw new Error('Unauthorized')
  }

  const query = supabase
    .from('staff_schedules_view')
    .select('id, staff_id, salon_id, day_of_week, start_time, end_time, is_active, break_start, break_end, effective_from, effective_until, created_at, updated_at')
    .eq('salon_id', salonId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  // Filter by effective dates if provided
  if (startDate) {
    query.or(`effective_from.is.null,effective_from.lte.${startDate}`)
  }

  if (endDate) {
    query.or(`effective_until.is.null,effective_until.gte.${endDate}`)
  }

  const { data, error } = await query

  if (error) throw error

  const schedules = (data || [])
    .filter(
      (row): row is StaffScheduleRow & { id: NonNullable<StaffScheduleRow['id']>; staff_id: NonNullable<StaffScheduleRow['staff_id']>; day_of_week: NonNullable<StaffScheduleRow['day_of_week']>; start_time: NonNullable<StaffScheduleRow['start_time']>; end_time: NonNullable<StaffScheduleRow['end_time']> } =>
        !!row.id && !!row.staff_id && !!row.day_of_week && !!row.start_time && !!row.end_time,
    )
    .map((row): StaffSchedule => ({
      id: row.id,
      staff_id: row.staff_id,
      day_of_week: row.day_of_week as DayOfWeek,
      start_time: row.start_time,
      end_time: row.end_time,
      break_start: row.break_start,
      break_end: row.break_end,
      is_recurring: true,
      is_active: row.is_active ?? false,
      created_at: row.created_at ?? new Date().toISOString(),
      updated_at: row.updated_at ?? new Date().toISOString(),
    }))
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
      .select('id, user_id, salon_id, title, bio, created_at')
      .in('id', staffIds)
      .is('deleted_at', null)

    if (staffError) throw staffError

    staffMap = new Map(
      (staffRows || [])
        .filter(
          (row): row is StaffProfileRow & { id: NonNullable<StaffProfileRow['id']>; salon_id: NonNullable<StaffProfileRow['salon_id']> } =>
            !!row.id && !!row.salon_id,
        )
        .map((row): [string, Staff] => {
          const staff: Staff = {
            id: row.id,
            user_id: row.user_id,
            salon_id: row.salon_id,
            full_name: row.title ?? null,
            email: null,
            title: row.title,
            status: null,
          }
          return [staff.id, staff]
        }),
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
    .select('id, staff_id, salon_id, day_of_week, start_time, end_time, is_active, break_start, break_end, effective_from, effective_until, created_at, updated_at')
    .eq('staff_id', staffId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (startDate) {
    query.or(`effective_from.is.null,effective_from.lte.${startDate}`)
  }

  if (endDate) {
    query.or(`effective_until.is.null,effective_until.gte.${endDate}`)
  }

  const { data, error } = await query

  if (error) throw error

  return (data || [])
    .filter(
      (row): row is StaffScheduleRow & { id: NonNullable<StaffScheduleRow['id']>; staff_id: NonNullable<StaffScheduleRow['staff_id']>; day_of_week: NonNullable<StaffScheduleRow['day_of_week']>; start_time: NonNullable<StaffScheduleRow['start_time']>; end_time: NonNullable<StaffScheduleRow['end_time']> } =>
        !!row.id && !!row.staff_id && !!row.day_of_week && !!row.start_time && !!row.end_time,
    )
    .map((row): StaffSchedule => ({
      id: row.id,
      staff_id: row.staff_id,
      day_of_week: row.day_of_week as DayOfWeek,
      start_time: row.start_time,
      end_time: row.end_time,
      break_start: row.break_start,
      break_end: row.break_end,
      is_recurring: true,
      is_active: row.is_active ?? false,
      created_at: row.created_at ?? new Date().toISOString(),
      updated_at: row.updated_at ?? new Date().toISOString(),
    }))
}
