export interface ScheduleSlot {
  day_of_week: string
  start_time: string
  end_time: string
  is_recurring: boolean
}

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface Staff {
  id: string
  user_id: string | null
  salon_id: string
  full_name: string | null
  email: string | null
  title: string | null
  status: string | null
}

export interface StaffSchedule {
  id: string
  staff_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  break_start: string | null
  break_end: string | null
  is_recurring: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StaffScheduleWithStaff extends StaffSchedule {
  staff?: Staff
}

export interface ScheduleConflict {
  has_conflict: boolean
  conflicting_schedules: StaffSchedule[]
  conflicting_appointments: Array<{
    id: string
    start_time: string
    end_time: string
    customer_name: string | null
  }>
}
