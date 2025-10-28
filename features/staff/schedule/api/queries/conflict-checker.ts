import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import type { Database } from '@/lib/types/database.types'
import type { ScheduleConflict, StaffSchedule } from '../types'

type AppointmentRow = Database['public']['Views']['appointments_view']['Row']

const DAY_MAP: Database['public']['Enums']['day_of_week'][] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

function toMinutes(time: string): number | null {
  if (!time) return null
  const [hours, minutes] = time.split(':')
  const parsedHours = Number(hours)
  const parsedMinutes = Number(minutes)
  if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
    return null
  }
  return parsedHours * 60 + parsedMinutes
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const startA = toMinutes(aStart)
  const endA = toMinutes(aEnd)
  const startB = toMinutes(bStart)
  const endB = toMinutes(bEnd)
  if (startA === null || endA === null || startB === null || endB === null) {
    return false
  }
  return startA < endB && startB < endA
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

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const authorizedStaffId = staffProfile['id']

  const dayIndex = new Date(workDate).getDay()
  const dayOfWeek = DAY_MAP[dayIndex]

  if (!dayOfWeek) {
    return false
  }

  const { data, error } = await supabase
    .from('staff_schedules_view')
    .select('*')
    .eq('staff_id', authorizedStaffId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .returns<StaffSchedule[]>()

  if (error) throw error

  const relevantSchedules = (data ?? []).filter((schedule) => {
    if (!schedule['id']) return false
    if (excludeScheduleId && schedule['id'] === excludeScheduleId) return false
    return true
  })

  return relevantSchedules.some((schedule) =>
    rangesOverlap(schedule['start_time'] ?? '', schedule['end_time'] ?? '', startTime, endTime),
  )
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

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const authorizedStaffId = staffProfile['id']

  const dayIndex = new Date(workDate).getDay()
  const dayOfWeek = DAY_MAP[dayIndex]

  if (!dayOfWeek) {
    return {
      has_conflict: false,
      conflicting_schedules: [],
      conflicting_appointments: [],
    }
  }

  const { data: schedules, error: scheduleError } = await supabase
    .from('staff_schedules_view')
    .select('*')
    .eq('staff_id', authorizedStaffId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .returns<StaffSchedule[]>()

  if (scheduleError) throw scheduleError

  const filteredSchedules = (schedules ?? []).filter((schedule) => {
    if (!schedule['id']) return false
    if (excludeScheduleId && schedule['id'] === excludeScheduleId) return false
    return rangesOverlap(schedule['start_time'] ?? '', schedule['end_time'] ?? '', startTime, endTime)
  })

  const targetRangeStart = new Date(`${workDate}T${startTime}`)
  const targetRangeEnd = new Date(`${workDate}T${endTime}`)

  const { data: appointments, error: appointmentError } = await supabase
    .from('appointments_view')
    .select('id, start_time, end_time, customer_id')
    .eq('staff_id', authorizedStaffId)
    .gte('start_time', `${workDate}T00:00:00`)
    .lte('start_time', `${workDate}T23:59:59`)
    .in('status', ['confirmed', 'pending'])
    .returns<Array<Pick<AppointmentRow, 'id' | 'start_time' | 'end_time' | 'customer_id'>>>()

  if (appointmentError) throw appointmentError

  const conflictingAppointments = (appointments ?? [])
    .filter((appointment) => appointment['id'] && appointment['start_time'] && appointment['end_time'])
    .map((appointment) => ({
      id: appointment['id'] as string,
      start_time: appointment['start_time'] as string,
      end_time: appointment['end_time'] as string,
      customer_name: null,
      startMs: new Date(appointment['start_time'] as string).getTime(),
      endMs: new Date(appointment['end_time'] as string).getTime(),
    }))
    .filter((appointment) =>
      appointment.startMs < targetRangeEnd.getTime() && targetRangeStart.getTime() < appointment.endMs,
    )
    .map(({ startMs, endMs, ...rest }) => rest)

  return {
    has_conflict: filteredSchedules.length > 0 || conflictingAppointments.length > 0,
    conflicting_schedules: filteredSchedules,
    conflicting_appointments: conflictingAppointments,
  }
}
