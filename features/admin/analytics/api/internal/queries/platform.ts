import 'server-only'

import { requireAdminClient } from '@/features/admin/analytics/api/admin-analytics-shared'
import type { PlatformAnalyticsSnapshot } from '@/features/admin/analytics/api/admin-analytics-types'
import type { Database } from '@/lib/types/database.types'
import {
  DAY_MS,
  DEFAULT_WINDOW_DAYS,
  PERFORMANCE_WINDOW_DAYS,
  REFRESH_LIMIT,
} from '@/features/admin/analytics/api/internal/platform-analytics/constants'
import { parseDate } from '@/features/admin/analytics/api/internal/platform-analytics/helpers'
import { buildGrowthMetrics } from '@/features/admin/analytics/api/internal/platform-analytics/growth'
import { buildRetentionMetrics } from '@/features/admin/analytics/api/internal/platform-analytics/retention'
import { buildAcquisitionMetrics } from '@/features/admin/analytics/api/internal/platform-analytics/acquisition'
import { buildFeatureUsageItems } from '@/features/admin/analytics/api/internal/platform-analytics/feature-usage'
import { buildPerformanceBenchmark } from '@/features/admin/analytics/api/internal/platform-analytics/performance'

type AnalyticsRow = {
  date: string | null
  platform_revenue?: number | null
  platform_new_customers?: number | null
  platform_returning_customers?: number | null
  platform_appointments?: number | null
  platform_cancelled_appointments?: number | null
  active_salons?: number | null
}

type DailyMetricsRow = {
  streaming_metrics: Record<string, unknown> | null
  salon_id: string | null
  total_revenue: number | null
  service_revenue: number | null
  product_revenue: number | null
  total_appointments: number | null
  utilization_rate: number | null
}

type UserRow = {
  created_at: string | null
  primary_role: string | null
  country_code: string | null
}

const ANALYTICS_DAILY_METRICS_TABLE = 'daily_metrics' satisfies keyof Database['analytics']['Tables']

export async function getPlatformAnalyticsSnapshot(
  options: { windowDays?: number } = {},
): Promise<PlatformAnalyticsSnapshot> {
  const windowDays = Math.max(options.windowDays ?? DEFAULT_WINDOW_DAYS, PERFORMANCE_WINDOW_DAYS)
  const supabase = await requireAdminClient()
  const analyticsSchema = supabase.schema('analytics')

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
    analyticsSchema
      .from(ANALYTICS_DAILY_METRICS_TABLE)
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

  const analyticsRows = ((analyticsRes.data ?? []) as AnalyticsRow[]).sort((a, b) => {
    const aDate = parseDate(a.date)
    const bDate = parseDate(b.date)
    if (!aDate || !bDate) return 0
    return aDate.getTime() - bDate.getTime()
  })

  const dailyMetrics = (dailyMetricsRes.data ?? []) as DailyMetricsRow[]
  const userRows = (usersRes.data ?? []) as UserRow[]

  const latestSnapshot = analyticsRows.length > 0 ? analyticsRows[analyticsRows.length - 1] : null
  const latestSnapshotDate = latestSnapshot?.date ?? null

  const growthResult = buildGrowthMetrics({
    analyticsRows: analyticsRows as AnalyticsRow[],
    thirtyDaysAgo,
    sixtyDaysAgo,
  })

  const retention = buildRetentionMetrics(analyticsRows as AnalyticsRow[], growthResult.totals)

  const acquisition = buildAcquisitionMetrics({
    userRows,
    thirtyDaysAgo,
    sevenDaysAgo,
    fourteenDaysAgo,
  })

  const featureUsageItems = buildFeatureUsageItems(dailyMetrics)
  const performanceBenchmark = await buildPerformanceBenchmark(supabase, dailyMetrics)

  return {
    timeframe: {
      start: windowStart.toISOString(),
      end: now.toISOString(),
    },
    latestSnapshotDate,
    growth: {
      summary: growthResult.summary,
      series: growthResult.series,
    },
    acquisition,
    retention,
    featureUsage: {
      items: featureUsageItems,
    },
    performance: performanceBenchmark,
  }
}
