import type { Database } from '@/lib/types/database.types'

export type StaffScheduleRow = Database['public']['Views']['staff_schedules']['Row']

export type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}
