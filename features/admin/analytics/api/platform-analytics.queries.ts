import 'server-only'

import { requireAdminClient } from './admin-analytics-shared'
import type {
  PlatformAnalyticsSnapshot,
  GrowthDelta,
  AcquisitionBreakdownItem,
  RetentionSeriesPoint,
  FeatureUsageItem,
  PerformanceBenchmark,
} from './admin-analytics-types'

const DAY_MS = 24 * 60 * 60 * 1000
const DEFAULT_WINDOW_DAYS = 90
const PERFORMANCE_WINDOW_DAYS = 30
const REFRESH_LIMIT = 5000

const toNumber = (value: number | null | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const computeDelta = (current: number, previous: number): GrowthDelta => {
  const delta = current - previous
  const deltaPercent = previous !== 0 ? delta / previous : 0
  return { current, previous, delta, deltaPercent }
}

const sumMetric = <T>(rows: T[], selector: (row: T) => number): number =>
  rows.reduce((acc, row) => acc + selector(row), 0)

const averageMetric = <T>(rows: T[], selector: (row: T) => number): number => {
  if (!rows.length) return 0
  return sumMetric(rows, selector) / rows.length
}

const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const buildBreakdown = (
  rows: Array<{ key: string | null | undefined }>,
  total: number,
  normalize: (value: string | null | undefined) => string,
): AcquisitionBreakdownItem[] => {
  if (!rows.length || !total) return []

  const counts = new Map<string, number>()
  rows.forEach((row) => {
    const label = normalize(row.key)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count]) => ({
      label,
      count,
      percentage: count / total,
    }))
}

export async function getPlatformAnalyticsSnapshot(
  options: { windowDays?: number } = {},
): Promise<PlatformAnalyticsSnapshot> {
  const windowDays = Math.max(options.windowDays ?? DEFAULT_WINDOW_DAYS, PERFORMANCE_WINDOW_DAYS)
  const supabase = await requireAdminClient()

  const now = new Date()
  const windowStart = new Date(now.getTime() - windowDays * DAY_MS)
  const performanceStart = new Date(now.getTime() - PERFORMANCE_WINDOW_DAYS * DAY_MS)
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * DAY_MS)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * DAY_MS)

  const [analyticsRes, dailyMetricsRes, usersRes] = await Promise.all([
    supabase
      .from('admin_analytics_overview')
      .select('*')
      .gte('date', windowStart.toISOString())
      .order('date', { ascending: false }),
    supabase
      .schema('analytics')
      .from('daily_metrics')
      .select(
        `metric_at,salon_id,total_revenue,service_revenue,product_revenue,total_appointments,new_customers,returning_customers,utilization_rate,active_staff_count,streaming_metrics`,
      )
      .gte('metric_at', performanceStart.toISOString())
      .order('metric_at', { ascending: false })
      .limit(REFRESH_LIMIT),
    supabase
      .from('admin_users_overview')
      .select('id,created_at,primary_role,country_code')
      .gte('created_at', windowStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(REFRESH_LIMIT),
  ])

  if (analyticsRes.error) throw analyticsRes.error
  if (dailyMetricsRes.error) throw dailyMetricsRes.error
  if (usersRes.error) throw usersRes.error

  const analyticsRows = (analyticsRes.data ?? []).sort((a, b) => {
    const aDate = parseDate(a.date)
    const bDate = parseDate(b.date)
    if (!aDate || !bDate) return 0
    return aDate.getTime() - bDate.getTime()
  })

  const dailyMetrics = dailyMetricsRes.data ?? []
  const userRows = usersRes.data ?? []

  const latestSnapshotDate = analyticsRows.length ? analyticsRows[analyticsRows.length - 1].date ?? null : null

  const currentWindowRows = analyticsRows.filter((row) => {
    const date = parseDate(row.date)
    return date ? date >= thirtyDaysAgo : false
  })

  const previousWindowRows = analyticsRows.filter((row) => {
    const date = parseDate(row.date)
    return date ? date >= sixtyDaysAgo && date < thirtyDaysAgo : false
  })

  const revenueCurrent = sumMetric(currentWindowRows, (row) => toNumber(row.platform_revenue))
  const revenuePrevious = sumMetric(previousWindowRows, (row) => toNumber(row.platform_revenue))

  const newCustomersCurrent = sumMetric(currentWindowRows, (row) => toNumber(row.platform_new_customers))
  const newCustomersPrevious = sumMetric(previousWindowRows, (row) => toNumber(row.platform_new_customers))

  const appointmentsCurrent = sumMetric(currentWindowRows, (row) => toNumber(row.platform_appointments))
  const appointmentsPrevious = sumMetric(previousWindowRows, (row) => toNumber(row.platform_appointments))

  const activeSalonsCurrent = averageMetric(currentWindowRows, (row) => toNumber(row.active_salons))
  const activeSalonsPrevious = averageMetric(previousWindowRows, (row) => toNumber(row.active_salons))

  const growthSeries = analyticsRows.map((row) => ({
    date: row.date ?? '',
    revenue: toNumber(row.platform_revenue),
    appointments: toNumber(row.platform_appointments),
    newCustomers: toNumber(row.platform_new_customers),
    returningCustomers: toNumber(row.platform_returning_customers),
    activeSalons: toNumber(row.active_salons),
    cancelledAppointments: toNumber(row.platform_cancelled_appointments),
  }))

  const totalNewCustomers = sumMetric(analyticsRows, (row) => toNumber(row.platform_new_customers))
  const totalReturningCustomers = sumMetric(analyticsRows, (row) => toNumber(row.platform_returning_customers))
  const totalCancelledAppointments = sumMetric(analyticsRows, (row) => toNumber(row.platform_cancelled_appointments))
  const totalAppointments = sumMetric(analyticsRows, (row) => toNumber(row.platform_appointments))

  const retentionSeries: RetentionSeriesPoint[] = analyticsRows
    .slice(-30)
    .map((row) => {
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

  const totalNewUsers = userRows.length
  const newUsersLast30Days = userRows.filter((user) => {
    const created = parseDate(user.created_at)
    return created ? created >= thirtyDaysAgo : false
  }).length
  const newUsersLast7Days = userRows.filter((user) => {
    const created = parseDate(user.created_at)
    return created ? created >= sevenDaysAgo : false
  }).length
  const newUsersPrev7Days = userRows.filter((user) => {
    const created = parseDate(user.created_at)
    return created ? created >= fourteenDaysAgo && created < sevenDaysAgo : false
  }).length

  const acquisitionByRole = buildBreakdown(
    userRows.map((user) => ({ key: user.primary_role })),
    totalNewUsers || 1,
    (value) => (value ? value.toString() : 'unknown'),
  )

  const acquisitionByCountry = buildBreakdown(
    userRows.map((user) => ({ key: user.country_code })),
    totalNewUsers || 1,
    (value) => (value ? value.toString().toUpperCase() : 'UNKNOWN'),
  )

  const featureCounts = new Map<string, number>()
  dailyMetrics.forEach((row) => {
    const metrics = row.streaming_metrics
    if (!metrics || Array.isArray(metrics) || typeof metrics !== 'object') return

    Object.entries(metrics as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        featureCounts.set(key, (featureCounts.get(key) ?? 0) + value)
      }
    })
  })

  const featureUsageItems: FeatureUsageItem[] = Array.from(featureCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => ({ key, count }))

  interface SalonAccumulator {
    totalRevenue: number
    totalAppointments: number
    utilizationSum: number
    utilizationCount: number
  }

  const salonAggregates = new Map<string, SalonAccumulator>()
  dailyMetrics.forEach((row) => {
    if (!row.salon_id) return
    const entry = salonAggregates.get(row.salon_id) ?? {
      totalRevenue: 0,
      totalAppointments: 0,
      utilizationSum: 0,
      utilizationCount: 0,
    }

    const revenue = toNumber(row.total_revenue) || toNumber(row.service_revenue) + toNumber(row.product_revenue)
    entry.totalRevenue += revenue
    entry.totalAppointments += toNumber(row.total_appointments)

    if (typeof row.utilization_rate === 'number' && Number.isFinite(row.utilization_rate)) {
      entry.utilizationSum += row.utilization_rate
      entry.utilizationCount += 1
    }

    salonAggregates.set(row.salon_id, entry)
  })

  const aggregatedPerformance = Array.from(salonAggregates.entries()).map(([salonId, entry]) => {
    const avgUtilization = entry.utilizationCount ? entry.utilizationSum / entry.utilizationCount : 0
    return {
      salonId,
      revenue: entry.totalRevenue,
      appointments: entry.totalAppointments,
      avgUtilization,
      revenuePerAppointment: entry.totalAppointments ? entry.totalRevenue / entry.totalAppointments : 0,
    }
  })

  const totalRevenueAcrossSalons = aggregatedPerformance.reduce((acc, item) => acc + item.revenue, 0)
  const totalAppointmentsAcrossSalons = aggregatedPerformance.reduce((acc, item) => acc + item.appointments, 0)
  const avgUtilizationAcrossSalons = aggregatedPerformance.length
    ? aggregatedPerformance.reduce((acc, item) => acc + item.avgUtilization, 0) / aggregatedPerformance.length
    : 0

  const topSalonIds = aggregatedPerformance
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((item) => item.salonId)

  let topSalons: PerformanceBenchmark[] = []
  if (topSalonIds.length) {
    const { data: salonDetails, error: salonError } = await supabase
      .from('admin_salons_overview')
      .select('id,name,business_name,subscription_tier,rating_average')
      .in('id', topSalonIds)

    if (salonError) {
      console.error('[PlatformAnalytics] Failed to fetch salon details', salonError)
    }

    const detailsMap = new Map<string, { name: string | null; subscription_tier: string | null; rating_average: number | null }>()
    salonDetails?.forEach((detail) => {
      if (detail.id) {
        detailsMap.set(detail.id, {
          name: detail.name ?? (detail as { business_name?: string | null }).business_name ?? null,
          subscription_tier: detail.subscription_tier ?? null,
          rating_average: detail.rating_average ?? null,
        })
      }
    })

    topSalons = aggregatedPerformance
      .filter((item) => topSalonIds.includes(item.salonId))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item) => {
        const detail = detailsMap.get(item.salonId)
        return {
          salonId: item.salonId,
          salonName: detail?.name ?? item.salonId,
          revenue: item.revenue,
          appointments: item.appointments,
          avgUtilization: item.avgUtilization,
          revenuePerAppointment: item.revenuePerAppointment,
          subscriptionTier: detail?.subscription_tier ?? null,
          ratingAverage: detail?.rating_average ?? null,
        }
      })
  }

  const performanceBenchmark = {
    avgUtilization: avgUtilizationAcrossSalons,
    revenuePerSalon: aggregatedPerformance.length ? totalRevenueAcrossSalons / aggregatedPerformance.length : 0,
    appointmentsPerSalon: aggregatedPerformance.length ? totalAppointmentsAcrossSalons / aggregatedPerformance.length : 0,
    topSalons,
  }

  const retention = {
    retentionRate: totalNewCustomers + totalReturningCustomers
      ? totalReturningCustomers / (totalNewCustomers + totalReturningCustomers)
      : 0,
    churnRate: totalAppointments ? totalCancelledAppointments / totalAppointments : 0,
    returningCustomers: totalReturningCustomers,
    newCustomers: totalNewCustomers,
    series: retentionSeries,
  }

  return {
    timeframe: {
      start: windowStart.toISOString(),
      end: now.toISOString(),
    },
    latestSnapshotDate,
    growth: {
      summary: {
        revenue: computeDelta(revenueCurrent, revenuePrevious),
        newCustomers: computeDelta(newCustomersCurrent, newCustomersPrevious),
        activeSalons: computeDelta(activeSalonsCurrent, activeSalonsPrevious),
        appointments: computeDelta(appointmentsCurrent, appointmentsPrevious),
      },
      series: growthSeries,
    },
    acquisition: {
      totalNewUsers,
      newUsersLast30Days,
      newUsersLast7Days,
      deltaLast7Days: newUsersLast7Days - newUsersPrev7Days,
      byRole: acquisitionByRole,
      byCountry: acquisitionByCountry,
    },
    retention,
    featureUsage: {
      items: featureUsageItems,
    },
    performance: performanceBenchmark,
  }
}
