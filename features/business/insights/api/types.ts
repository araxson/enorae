import 'server-only'
import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
export type AppointmentServiceRow =
  Database['scheduling']['Tables']['appointment_services']['Row']
export type ReviewRow = Database['engagement']['Tables']['salon_reviews']['Row']
export type ServiceRow = Database['public']['Views']['services_view']['Row']
export type StaffProfileRow = Database['public']['Views']['profiles_view']['Row']

export type AppointmentWithProfile = {
  id: string
  customer_id: string
  created_at: string
  status: string | null
  staff_id: string | null
  profiles: {
    username: string | null
  } | null
}

export interface CustomerAggregate {
  customerId: string
  name: string
  email: string
  appointments: AppointmentWithProfile[]
}

export interface ServiceAggregation {
  serviceCounts: Map<string, number>
  staffCounts: Map<string, number>
}

export interface ReviewSummary {
  total: number
  count: number
}
