import type { RetentionSeriesPoint } from '@/features/admin/analytics/api/admin-analytics-types'
import { toNumber } from '@/lib/utils/analytics-calculations'
import type { GrowthMetricsResult } from './growth'

type AnalyticsRow = {
  date: string | null
  platform_new_customers?: number | null
  platform_returning_customers?: number | null
  platform_cancelled_appointments?: number | null
  platform_appointments?: number | null
}

export interface RetentionMetrics {
  retentionRate: number
  churnRate: number
  returningCustomers: number
  newCustomers: number
  series: RetentionSeriesPoint[]
}

export function buildRetentionMetrics(
  analyticsRows: AnalyticsRow[],
  totals: GrowthMetricsResult['totals'],
): RetentionMetrics {
  const retentionSeries: RetentionSeriesPoint[] = analyticsRows.slice(-30).map((row) => {
    const newCount = toNumber(row.platform_new_customers)
    const returningCount = toNumber(row.platform_returning_customers)
    const cancelledCount = toNumber(row.platform_cancelled_appointments)
    const totalCount = newCount + returningCount
    const appointments = toNumber(row.platform_appointments)

    return {
      date: row.date ?? '',
      retentionRate: totalCount ? returningCount / totalCount : 0,
      churnRate: appointments ? cancelledCount / appointments : 0,
      newCustomers: newCount,
      returningCustomers: returningCount,
      cancelledAppointments: cancelledCount,
    }
  })

  const retentionRate =
    totals.newCustomers + totals.returningCustomers
      ? totals.returningCustomers / (totals.newCustomers + totals.returningCustomers)
      : 0
  const churnRate = totals.appointments ? totals.cancelledAppointments / totals.appointments : 0

  return {
    retentionRate,
    churnRate,
    returningCustomers: totals.returningCustomers,
    newCustomers: totals.newCustomers,
    series: retentionSeries,
  }
}
