import type { Database } from '@/lib/types/database.types'

export type Service = Database['public']['Views']['services_view']['Row']
export type Staff = Database['public']['Views']['staff_profiles_view']['Row']

export interface BookingFormProps {
  salonId: string
  salonName: string
  services: Service[]
  staff: Staff[]
}

export interface BookingFormValues {
  serviceId: string
  staffId: string
  date: string
  time: string
  notes?: string
}
