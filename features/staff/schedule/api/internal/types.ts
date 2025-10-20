import type { Database } from '@/lib/types/database.types'

export type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']
export type Staff = Database['public']['Views']['staff']['Row']

export type StaffScheduleWithStaff = StaffSchedule & {
  staff: Staff | null
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
