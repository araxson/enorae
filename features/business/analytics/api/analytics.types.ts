import type { Database } from '@/lib/types/database.types'

export type AppointmentService = Database['public']['Views']['appointment_services']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']
export type DailyMetric = Database['public']['Views']['daily_metrics']['Row']

export type ServiceStats = {
  name: string
  count: number
  revenue: number
}

export type StaffStats = {
  name: string
  title: string | null
  count: number
  revenue: number
}
