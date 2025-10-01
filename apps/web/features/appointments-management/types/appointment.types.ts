import type { Database } from '@enorae/database/types'

export type Appointment = Database['public']['Views']['appointments']['Row']

export interface AppointmentWithDetails extends Appointment {
  customer_name?: string
  service_names?: string[]
  staff_name?: string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface AppointmentFilters {
  status?: AppointmentStatus
  date?: string
  staffId?: string
}