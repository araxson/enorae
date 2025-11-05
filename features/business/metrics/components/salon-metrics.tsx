import { getLatestSalonMetrics, getDailyMetrics } from '../api/queries'
import { ComparativeMetrics } from './comparative-metrics'
import { MetricsOverview } from './metrics-overview'
import { RevenueChart } from './revenue-chart'
import { RevenueForecastCard } from './revenue-forecast-card'
import { StaffPerformanceCard, ServicePopularityChart } from '@/features/business/common/components'
import { getTopStaff, getTopServices } from '@/features/business/analytics/api/queries'
import { getUserSalon } from '@/features/business/common/api/queries'
import { buildPeriodComparisons, buildRevenueForecast } from '@/features/business/metrics/utils'
import { OperationalDashboard } from '@/features/business/metrics-operational/components'
import { getOperationalMetrics } from '@/features/business/metrics-operational/api/queries'

export async function SalonMetrics(): Promise<React.JSX.Element> {
  const salon = await getUserSalon()

  if (!salon?.id) {
    throw new Error('Salon not found')
  }

  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 29)

  const startDateStr = startDate.toISOString().split('T')[0] || ''
  const endDateStr = endDate.toISOString().split('T')[0] || ''

  const [latestMetrics, dailyMetrics, topStaff, topServices, operationalMetrics] =
    await Promise.all([
      getLatestSalonMetrics(),
      getDailyMetrics(60),
      getTopStaff(
        salon.id,
        startDateStr,
        endDateStr,
        5
      ),
      getTopServices(
        salon.id,
        startDateStr,
        endDateStr,
        8
      ),
      getOperationalMetrics(salon.id),
    ])

  const comparison = buildPeriodComparisons(dailyMetrics)
  const forecast = buildRevenueForecast(dailyMetrics)
  const recentMetrics = dailyMetrics.slice(-30)

  type TopStaffEntry = { name: string; title: string | null; count: number; revenue: number }
  const staffLeaderboard = topStaff.map((staff: TopStaffEntry, index: number) => ({
    id: `staff-${index}-${staff.name}`,
    name: staff.name,
    title: staff.title,
    avatar: null,
    appointmentCount: staff.count,
    totalRevenue: staff.revenue,
  }))

  type TopServiceEntry = { name: string; count: number; revenue: number }
  const popularServices = topServices.map((service: TopServiceEntry) => ({
    name: service.name,
    count: service.count,
    revenue: service.revenue,
  }))

  return (
    <div className="flex flex-col gap-8">
      <MetricsOverview metrics={latestMetrics} />
      <ComparativeMetrics comparison={comparison} />
      <RevenueChart data={recentMetrics} />
      <RevenueForecastCard forecast={forecast} />
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        <StaffPerformanceCard staff={staffLeaderboard} />
        <ServicePopularityChart
          data={popularServices}
          title="Service Popularity"
          description="Top services by bookings and revenue"
        />
      </div>
      <OperationalDashboard metrics={operationalMetrics} />
    </div>
  )
}
