import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['appointments']['Row']
export type AppointmentServiceRow =
  Database['public']['Views']['appointment_services']['Row']
export type ReviewRow = Database['public']['Views']['salon_reviews']['Row']
export type ServiceRow = Database['public']['Views']['services']['Row']
export type StaffProfileRow = Database['public']['Views']['profiles']['Row']

export type AppointmentWithProfile = {
  id: string
  customer_id: string
  created_at: string
  status: string | null
  staff_id: string | null
  profiles: {
    display_name: string | null
    email: string | null
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
