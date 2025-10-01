import type { Database } from '@enorae/database/types'

export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']

export interface TimeSlot {
  time: string
  available: boolean
  staffId?: string
}

export interface BookingFormData {
  salonId: string
  serviceId: string
  staffId: string
  date: string
  time: string
}