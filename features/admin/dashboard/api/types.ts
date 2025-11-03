'use server'

import type { Database } from '@/lib/types/database.types'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type AppointmentStatus = Database['public']['Enums']['appointment_status']

// Map actual database tables to admin overview types
// These were previously from non-existent views, now using base tables
// Using partial types to handle field mismatches between views and tables

type DailyMetrics = Database['analytics']['Tables']['daily_metrics']['Row']
type Appointment = Database['scheduling']['Tables']['appointments']['Row']
type SalonReview = Database['engagement']['Tables']['salon_reviews']['Row']
type Message = Database['communication']['Tables']['messages']['Row']
type StaffProfile = Database['organization']['Tables']['staff_profiles']['Row']

export type RevenueOverview = DailyMetrics & {
  date?: string
  revenue_total?: number
  revenue_trend?: number
}

export type AppointmentsOverview = Appointment & {
  customer_name?: string | null
  customer_email?: string | null
  salon_name?: string | null
  salon_business_name?: string | null
  staff_name?: string | null
  service_name?: string | null
  service_count?: number | null
  total_price?: number | null
}

export type ReviewsOverview = SalonReview & {
  salon_name?: string
  customer_name?: string
  has_response?: boolean
  helpful_count?: number
  moderation_status?: string
}

export type MessagesOverview = Message & {
  subject?: string
  customer_name?: string
  salon_name?: string
  unread_count?: number
  attachment_count?: number
}

export type StaffOverview = StaffProfile & {
  full_name?: string
  salon_name?: string
  salon_slug?: string
  staff_role?: string
  email?: string
  is_active?: boolean
  specialties?: string[]
}
