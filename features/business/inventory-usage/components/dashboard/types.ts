import type { UsageAnalytics, UsageTrend, ServiceCostAnalysis } from '../../api/queries'

export interface UsageAnalyticsDashboardProps {
  analytics: UsageAnalytics
  trends: UsageTrend[]
  serviceCosts: ServiceCostAnalysis[]
  highUsageProducts: Awaited<ReturnType<typeof import('../../api/queries').getHighUsageProducts>>
}
