import type { Database } from '@/lib/types/database.types'

// Map actual database tables to admin overview types
// These were previously from non-existent views, now using base tables
// Using partial types to handle field mismatches between views and tables

type DailyMetrics = Database['analytics']['Tables']['daily_metrics']['Row']
type Appointment = Database['scheduling']['Tables']['appointments']['Row']
type SalonReview = Database['engagement']['Tables']['salon_reviews']['Row']
type Message = Database['communication']['Tables']['messages']['Row']
type StaffProfile = Database['organization']['Tables']['staff_profiles']['Row']

export type RevenueOverview = DailyMetrics & { date?: string; [key: string]: any }
export type AppointmentsOverview = Appointment & {
  customer_name?: string
  customer_email?: string
  salon_name?: string
  salon_business_name?: string
  staff_name?: string
  [key: string]: any
}
export type ReviewsOverview = SalonReview & {
  salon_name?: string
  customer_name?: string
  has_response?: boolean
  helpful_count?: number
  [key: string]: any
}
export type MessagesOverview = Message & {
  subject?: string
  customer_name?: string
  salon_name?: string
  [key: string]: any
}
export type StaffOverview = StaffProfile & {
  full_name?: string
  salon_name?: string
  salon_slug?: string
  staff_role?: string
  email?: string
  [key: string]: any
}
