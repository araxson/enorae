import 'server-only'
import type { Database } from '@/lib/types/database.types'

export type StaffSchedule = Database['public']['Views']['staff_schedules_view']['Row']
export type Staff = Database['public']['Views']['staff_profiles_view']['Row']

export type StaffScheduleWithStaff = StaffSchedule & {
  staff: Staff | null
}

export interface StaffScheduleSlot {
  id: string
  staff_id: string
  salon_id: string
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start_time: string
  end_time: string
  break_start: string | null
  break_end: string | null
  effective_from: string | null
  effective_until: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StaffScheduleDay {
  dayOfWeek: string
  slots: StaffScheduleSlot[]
  isAvailable: boolean
}

export interface ScheduleConflict {
  has_conflict: boolean
  conflicting_schedules: StaffSchedule[]
  conflicting_appointments: {
    id: string
    start_time: string
    end_time: string
  }[]
}
