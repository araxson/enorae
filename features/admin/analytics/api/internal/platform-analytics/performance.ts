import type { PlatformAnalyticsSnapshot, PerformanceBenchmark } from '../../admin-analytics-types'
import { toNumber } from './helpers'

type DailyMetricsRow = {
  salon_id: string | null
  total_revenue: number | null
  service_revenue: number | null
  product_revenue: number | null
  total_appointments: number | null
  utilization_rate: number | null
}

type AdminClient = Awaited<
  ReturnType<typeof import('../../admin-analytics-shared')['requireAdminClient']>
>

type SalonOverviewRow = {
  id: string | null
  name: string | null
  business_name?: string | null
  subscription_tier: string | null
  rating_average: number | null
}

interface SalonAccumulator {
  totalRevenue: number
  totalAppointments: number
  utilizationSum: number
  utilizationCount: number
}

export async function buildPerformanceBenchmark(
  supabase: AdminClient,
  dailyMetrics: DailyMetricsRow[],
): Promise<PlatformAnalyticsSnapshot['performance']> {
  const salonAggregates = new Map<string, SalonAccumulator>()

  dailyMetrics.forEach((row) => {
    if (!row.salon_id) return
    const entry = salonAggregates.get(row.salon_id) ?? {
      totalRevenue: 0,
      totalAppointments: 0,
      utilizationSum: 0,
      utilizationCount: 0,
    }

    const revenue =
      toNumber(row.total_revenue) || toNumber(row.service_revenue) + toNumber(row.product_revenue)

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
      revenuePerAppointment: entry.totalAppointments
        ? entry.totalRevenue / entry.totalAppointments
        : 0,
    }
  })

  const totalRevenueAcrossSalons = aggregatedPerformance.reduce((acc, item) => acc + item.revenue, 0)
  const totalAppointmentsAcrossSalons = aggregatedPerformance.reduce(
    (acc, item) => acc + item.appointments,
    0,
  )
  const avgUtilizationAcrossSalons = aggregatedPerformance.length
    ? aggregatedPerformance.reduce((acc, item) => acc + item.avgUtilization, 0) /
      aggregatedPerformance.length
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

    const detailsMap = new Map<string, SalonOverviewRow>()

    ;(salonDetails as SalonOverviewRow[] | null | undefined)?.forEach((detail) => {
      if (detail.id) {
        detailsMap.set(detail.id, {
          id: detail.id,
          name: detail.name,
          business_name: detail.business_name,
          subscription_tier: detail.subscription_tier,
          rating_average: detail.rating_average,
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
          salonName: detail?.name ?? detail?.business_name ?? item.salonId,
          revenue: item.revenue,
          appointments: item.appointments,
          avgUtilization: item.avgUtilization,
          revenuePerAppointment: item.revenuePerAppointment,
          subscriptionTier: detail?.subscription_tier ?? null,
          ratingAverage: detail?.rating_average ?? null,
        }
      })
  }

  return {
    avgUtilization: avgUtilizationAcrossSalons,
    revenuePerSalon: aggregatedPerformance.length
      ? totalRevenueAcrossSalons / aggregatedPerformance.length
      : 0,
    appointmentsPerSalon: aggregatedPerformance.length
      ? totalAppointmentsAcrossSalons / aggregatedPerformance.length
      : 0,
    topSalons,
  }
}
