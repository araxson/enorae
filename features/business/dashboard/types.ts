import type { Database } from '@/lib/types/database.types'

// Database view types
export type AppointmentWithDetails = Database['public']['Views']['appointments_view']['Row']
export type SalonView = Database['public']['Views']['salons_view']['Row']

export type BusinessDashboardMetrics = {
  totalAppointments: number
  confirmedAppointments: number
  pendingAppointments: number
  totalStaff: number
  totalServices: number
  totalRevenue?: number
  last30DaysRevenue?: number
}

export type BusinessReviewStats = {
  totalReviews: number
  averageRating: number
  ratingDistribution: Array<{ rating: number; count: number }>
  pendingResponses: number
  flaggedCount: number
}

export type BusinessMultiLocationMetrics = {
  totalLocations: number
  totalAppointments: number
  confirmedAppointments: number
  pendingAppointments: number
  totalStaff: number
  totalServices: number
}

export type BusinessDashboardState = {
  salon: SalonView
  metrics: BusinessDashboardMetrics
  reviewStats: BusinessReviewStats
  recentAppointments: AppointmentWithDetails[]
  multiLocationMetrics?: BusinessMultiLocationMetrics | null
  isTenantOwner: boolean
}

export type DashboardFilterPreset = {
  label: string
  value: string
  description?: string
}
