import {
  getRevenueTrendData,
  getAppointmentConversionData,
  getStaffPerformanceData,
  getServicePopularityData,
} from '../api/analytics-queries'
import { getCustomerInsights } from '../api/customer-queries'
import { getOperationalMetrics } from '../api/operational-queries'
import {
  RevenueTrendChart,
  AppointmentConversionChart,
  StaffPerformanceCard,
  ServicePopularityChart,
  CustomerInsightsCard,
  OperationalMetricsDashboard,
} from '@/features/business/business-common/components'
import { Stack, Grid } from '@/components/layout'

interface AnalyticsTabProps {
  salonId: string
}

export async function AnalyticsTab({ salonId }: AnalyticsTabProps) {
  // Fetch all analytics data in parallel
  const [
    revenueTrend,
    conversionData,
    staffPerformance,
    servicePopularity,
    customerInsights,
    operationalMetrics
  ] = await Promise.all([
    getRevenueTrendData(salonId, 30),
    getAppointmentConversionData(salonId),
    getStaffPerformanceData(salonId, 5),
    getServicePopularityData(salonId, 8),
    getCustomerInsights(salonId),
    getOperationalMetrics(salonId),
  ])

  return (
    <Stack gap="lg">
      {/* Revenue Trend Chart */}
      <RevenueTrendChart data={revenueTrend} showBreakdown />

      {/* Appointment Conversion & Service Popularity */}
      <Grid cols={{ base: 1, lg: 2 }} gap="lg">
        <AppointmentConversionChart data={conversionData} />
        <ServicePopularityChart data={servicePopularity} />
      </Grid>

      {/* Customer Insights */}
      <CustomerInsightsCard data={customerInsights} />

      {/* Operational Metrics */}
      <OperationalMetricsDashboard metrics={operationalMetrics} />

      {/* Staff Performance */}
      <StaffPerformanceCard staff={staffPerformance} />
    </Stack>
  )
}
