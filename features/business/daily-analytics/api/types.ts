import type { Database } from '@/lib/types/database.types'

export interface DailyAnalyticsState {}

export interface DailyAnalyticsParams {}

export type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']

export type AggregatedMetrics = {
  totalRevenue: number
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  newCustomers: number
  returningCustomers: number
  avgUtilization: number
  serviceRevenue: number
  productRevenue: number
}

export type TrendMetrics = {
  revenue: number
  appointments: number
  customers: number
  utilization: number
}

export type DailyMetricsDashboardProps = {
  metrics: DailyMetric[]
  aggregated: AggregatedMetrics
  trends: TrendMetrics
}
