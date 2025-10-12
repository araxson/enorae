import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export { getAnalyticsOverview, type AnalyticsOverview } from './queries/overview'
export { getChainSalonBreakdown, getChainRevenueComparison } from './queries/chain-analytics'
export { getDailyMetricsTimeSeries, getCustomerTrends } from './queries/time-series'
export { getTopServices, getTopStaff, type ServicePerformance, type StaffPerformance } from './queries/top-performers'
export { getCustomerInsights, type CustomerInsights } from './queries/customer-insights'
export { getCustomerCohorts, type CustomerCohort } from './queries/customer-cohorts'
export { getCustomerSegmentation } from './queries/customer-segmentation'
export { getAppointmentStats } from './queries/appointments'

export async function getAnalyticsSalon() {
  const { requireUserSalonId } = await import('@/lib/auth')
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}
