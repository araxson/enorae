import type { Database } from '@/lib/types/database.types'

export type AppointmentService = Database['scheduling']['Tables']['appointment_services']['Row']
export type Appointment = Database['public']['Views']['appointments_view']['Row']
export type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']

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
