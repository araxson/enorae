import {
  getRevenueTrendData,
  getAppointmentConversionData,
  getStaffPerformanceData,
  getServicePopularityData,
} from '@/features/business/dashboard/api/queries/analytics'
import { getCustomerInsights } from '@/features/business/dashboard/api/queries/customer'
import { getOperationalMetrics } from '@/features/business/dashboard/api/queries/operational'
import {
  RevenueTrendChart,
  AppointmentConversionChart,
  StaffPerformanceCard,
  ServicePopularityChart,
  CustomerInsightsCard,
  OperationalMetricsDashboard,
} from '@/features/business/business-common/components'

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
    <div className="flex flex-col gap-6">
      {/* Revenue Trend Chart */}
      <RevenueTrendChart data={revenueTrend} showBreakdown />

      {/* Appointment Conversion & Service Popularity */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AppointmentConversionChart data={conversionData} />
        <ServicePopularityChart data={servicePopularity} />
      </div>

      {/* Customer Insights */}
      <CustomerInsightsCard data={customerInsights} />

      {/* Operational Metrics */}
      <OperationalMetricsDashboard metrics={operationalMetrics} />

      {/* Staff Performance */}
      <StaffPerformanceCard staff={staffPerformance} />
    </div>
  )
}
