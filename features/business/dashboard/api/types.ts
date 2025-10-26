import type { Database } from '@/lib/types/database.types'

export type SalonView = Database['public']['Views']['salons_view']['Row']

export type AppointmentWithDetails = Database['public']['Views']['appointments_view']['Row'] & {
  customer_name?: string | null
  service_name?: string | null
  staff_name?: string | null
}
