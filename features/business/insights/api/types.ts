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

export type CustomerSegment = 'VIP' | 'Loyal' | 'Regular' | 'At Risk' | 'New' | 'Churned'

export interface CustomerMetrics {
  customer_id: string
  customer_name: string
  customer_email: string
  first_visit_date: string
  last_visit_date: string
  total_visits: number
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  cancellation_rate: number
  no_show_rate: number
  review_count: number
  average_rating: number
  total_services: number
  favorite_service_name: string
  favorite_staff_name: string
  lifetime_value: number
  segment: CustomerSegment
}

export interface CustomerSegmentation {
  vip: number
  loyal: number
  regular: number
  at_risk: number
  new: number
  churned: number
}

export interface InsightsSummary {
  total_customers: number
  active_customers: number
  avg_lifetime_value: number
  avg_visits_per_customer: number
  retention_rate: number
  churn_rate: number
  segmentation: CustomerSegmentation
}
