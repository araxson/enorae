import type { Database } from '@enorae/database/types'

export type Salon = Database['public']['Views']['salons']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']

export interface DashboardMetrics {
  totalAppointments: number
  todayAppointments: number
  upcomingAppointments: number
  recentBookings: Appointment[]
}