import type { Database } from '@/lib/types/database.types'

export type AdminAnalyticsRow = Database['public']['Views']['admin_analytics_overview_view']['Row']
export type AdminAppointmentRow = Database['public']['Views']['admin_appointments_overview_view']['Row']
export type AdminSalonRow = Database['public']['Views']['admin_salons_overview_view']['Row']
export type AdminUserRow = Database['public']['Views']['admin_users_overview_view']['Row']
export type AdminReviewRow = Database['public']['Views']['admin_reviews_overview_view']['Row']
export type AdminStaffRow = Database['public']['Views']['admin_staff_overview_view']['Row']
export type AdminRevenueRow = Database['public']['Views']['admin_revenue_overview_view']['Row']
export type AdminMessageRow = Database['public']['Views']['admin_messages_overview_view']['Row']

export interface GrowthDelta {
  current: number
  previous: number
  delta: number
  deltaPercent: number
}

export interface PlatformGrowthPoint {
  date: string
  revenue: number
  appointments: number
  newCustomers: number
  returningCustomers: number
  activeSalons: number
  cancelledAppointments: number
}

export interface AcquisitionBreakdownItem {
  label: string
  count: number
  percentage: number
}

export interface RetentionSeriesPoint {
  date: string
  retentionRate: number
  churnRate: number
  newCustomers: number
  returningCustomers: number
  cancelledAppointments: number
}

export interface FeatureUsageItem {
  key: string
  count: number
}

export interface PerformanceBenchmark {
  salonId: string
  salonName: string | null
  revenue: number
  appointments: number
  avgUtilization: number
  revenuePerAppointment: number
  subscriptionTier: string | null
  ratingAverage: number | null
}

export interface PlatformAnalyticsSnapshot {
  timeframe: {
    start: string
    end: string
  }
  latestSnapshotDate: string | null
  growth: {
    summary: {
      revenue: GrowthDelta
      newCustomers: GrowthDelta
      activeSalons: GrowthDelta
      appointments: GrowthDelta
    }
    series: PlatformGrowthPoint[]
  }
  acquisition: {
    totalNewUsers: number
    newUsersLast30Days: number
    newUsersLast7Days: number
    deltaLast7Days: number
    byRole: AcquisitionBreakdownItem[]
    byCountry: AcquisitionBreakdownItem[]
  }
  retention: {
    retentionRate: number
    churnRate: number
    returningCustomers: number
    newCustomers: number
    series: RetentionSeriesPoint[]
  }
  featureUsage: {
    items: FeatureUsageItem[]
  }
  performance: {
    avgUtilization: number
    revenuePerSalon: number
    appointmentsPerSalon: number
    topSalons: PerformanceBenchmark[]
  }
}
