import type { GrowthDelta } from '@/features/admin/analytics/api/internal/admin-analytics-types'
import { averageMetric, computeDelta, sumMetric, toNumber } from './helpers'

type AnalyticsRow = {
  date: string | null
  platform_revenue?: number | null
  platform_new_customers?: number | null
  platform_returning_customers?: number | null
  platform_appointments?: number | null
  platform_cancelled_appointments?: number | null
  active_salons?: number | null
}

type GrowthSeriesPoint = {
  date: string
  revenue: number
  appointments: number
  newCustomers: number
  returningCustomers: number
  activeSalons: number
  cancelledAppointments: number
}

export interface GrowthMetricsResult {
  summary: {
    revenue: GrowthDelta
    newCustomers: GrowthDelta
    activeSalons: GrowthDelta
    appointments: GrowthDelta
  }
  series: GrowthSeriesPoint[]
  totals: {
    newCustomers: number
    returningCustomers: number
    cancelledAppointments: number
    appointments: number
  }
}

interface BuildGrowthMetricsParams {
  analyticsRows: AnalyticsRow[]
  thirtyDaysAgo: Date
  sixtyDaysAgo: Date
}

const isWithinRange = (row: AnalyticsRow, start: Date, end?: Date) => {
  const date = row.date ? new Date(row.date) : null
  if (!date || Number.isNaN(date.getTime())) return false
  if (end && date >= end) return false
  return date >= start
}

export function buildGrowthMetrics({
  analyticsRows,
  thirtyDaysAgo,
  sixtyDaysAgo,
}: BuildGrowthMetricsParams): GrowthMetricsResult {
  const currentWindowRows = analyticsRows.filter((row) => isWithinRange(row, thirtyDaysAgo))
  const previousWindowRows = analyticsRows.filter((row) =>
    isWithinRange(row, sixtyDaysAgo, thirtyDaysAgo),
  )

  const revenueCurrent = sumMetric(currentWindowRows, (row) => toNumber(row.platform_revenue))
  const revenuePrevious = sumMetric(previousWindowRows, (row) => toNumber(row.platform_revenue))

  const newCustomersCurrent = sumMetric(currentWindowRows, (row) =>
    toNumber(row.platform_new_customers),
  )
  const newCustomersPrevious = sumMetric(previousWindowRows, (row) =>
    toNumber(row.platform_new_customers),
  )

  const appointmentsCurrent = sumMetric(currentWindowRows, (row) =>
    toNumber(row.platform_appointments),
  )
  const appointmentsPrevious = sumMetric(previousWindowRows, (row) =>
    toNumber(row.platform_appointments),
  )

  const activeSalonsCurrent = averageMetric(currentWindowRows, (row) => toNumber(row.active_salons))
  const activeSalonsPrevious = averageMetric(previousWindowRows, (row) =>
    toNumber(row.active_salons),
  )

  const growthSeries: GrowthSeriesPoint[] = analyticsRows.map((row) => ({
    date: row.date ?? '',
    revenue: toNumber(row.platform_revenue),
    appointments: toNumber(row.platform_appointments),
    newCustomers: toNumber(row.platform_new_customers),
    returningCustomers: toNumber(row.platform_returning_customers),
    activeSalons: toNumber(row.active_salons),
    cancelledAppointments: toNumber(row.platform_cancelled_appointments),
  }))

  const totalNewCustomers = sumMetric(analyticsRows, (row) => toNumber(row.platform_new_customers))
  const totalReturningCustomers = sumMetric(analyticsRows, (row) =>
    toNumber(row.platform_returning_customers),
  )
  const totalCancelledAppointments = sumMetric(analyticsRows, (row) =>
    toNumber(row.platform_cancelled_appointments),
  )
  const totalAppointments = sumMetric(analyticsRows, (row) =>
    toNumber(row.platform_appointments),
  )

  return {
    summary: {
      revenue: computeDelta(revenueCurrent, revenuePrevious),
      newCustomers: computeDelta(newCustomersCurrent, newCustomersPrevious),
      activeSalons: computeDelta(activeSalonsCurrent, activeSalonsPrevious),
      appointments: computeDelta(appointmentsCurrent, appointmentsPrevious),
    },
    series: growthSeries,
    totals: {
      newCustomers: totalNewCustomers,
      returningCustomers: totalReturningCustomers,
      cancelledAppointments: totalCancelledAppointments,
      appointments: totalAppointments,
    },
  }
}
