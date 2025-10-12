import type { Database } from '@/lib/types/database.types'

export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']

export interface BookingFormProps {
  salonId: string
  salonName: string
  services: Service[]
  staff: Staff[]
}
