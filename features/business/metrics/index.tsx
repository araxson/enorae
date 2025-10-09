import { getLatestSalonMetrics, getDailyMetrics } from './api/queries'
import { MetricsOverview } from './components/metrics-overview'
import { RevenueChart } from './components/revenue-chart'
import { ComparativeMetrics } from './components/comparative-metrics'
import { RevenueForecastCard } from './components/revenue-forecast-card'
import { Stack, Grid } from '@/components/layout'
import { StaffPerformanceCard, ServicePopularityChart } from '@/features/business/shared/components'
import { getTopStaff, getTopServices } from '@/features/business/analytics/api/queries'
import { getUserSalon } from '@/features/business/shared/api/salon.queries'
import { buildPeriodComparisons, buildRevenueForecast } from './utils/analytics'
import { OperationalDashboard } from './operational/components/operational-dashboard'
import { getOperationalMetrics } from './operational/api/queries'

export async function SalonMetrics() {
  const salon = await getUserSalon()

  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 29)

  const [latestMetrics, dailyMetrics, topStaff, topServices, operationalMetrics] =
    await Promise.all([
      getLatestSalonMetrics(),
      getDailyMetrics(60),
      getTopStaff(
        salon.id,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        5
      ),
      getTopServices(
        salon.id,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        8
      ),
      getOperationalMetrics(salon.id),
    ])

  const comparison = buildPeriodComparisons(dailyMetrics)
  const forecast = buildRevenueForecast(dailyMetrics)
  const recentMetrics = dailyMetrics.slice(-30)

  const staffLeaderboard = topStaff.map((staff, index) => ({
    id: `staff-${index}-${staff.name}`,
    name: staff.name,
    title: staff.title,
    avatar: null,
    appointmentCount: staff.count,
    totalRevenue: staff.revenue,
  }))

  const popularServices = topServices.map((service) => ({
    name: service.name,
    count: service.count,
    revenue: service.revenue,
  }))

  return (
    <Stack gap="xl">
      <MetricsOverview metrics={latestMetrics} />
      <ComparativeMetrics comparison={comparison} />
      <RevenueChart data={recentMetrics} />
      <RevenueForecastCard forecast={forecast} />
      <Grid cols={{ base: 1, xl: 2 }} gap="xl">
        <StaffPerformanceCard staff={staffLeaderboard} />
        <ServicePopularityChart
          data={popularServices}
          title="Service Popularity"
          description="Top services by bookings and revenue"
        />
      </Grid>
      <OperationalDashboard metrics={operationalMetrics} />
    </Stack>
  )
}
