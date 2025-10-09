import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export { getAnalyticsOverview, type AnalyticsOverview } from './overview.queries'
export { getChainSalonBreakdown, getChainRevenueComparison } from './chain-analytics.queries'
export { getDailyMetricsTimeSeries, getCustomerTrends } from './time-series.queries'
export { getTopServices, getTopStaff, type ServicePerformance, type StaffPerformance } from './top-performers.queries'
export { getCustomerInsights, type CustomerInsights } from './customer-insights.queries'
export { getCustomerCohorts, type CustomerCohort } from './customer-cohorts.queries'
export { getCustomerSegmentation } from './customer-segmentation.queries'

export async function getAnalyticsSalon() {
  const { requireUserSalonId } = await import('@/lib/auth')
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}
