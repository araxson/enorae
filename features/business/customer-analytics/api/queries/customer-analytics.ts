import 'server-only'

import {
  getAnalyticsSalon,
  getCustomerInsights,
  getCustomerSegmentation,
  getCustomerCohorts,
  type CustomerInsights,
} from '@/features/business/analytics/api/queries'
import {
  getAtRiskCustomers,
  getReactivationOpportunities,
} from '@/features/business/insights/api/queries/churn-prediction'

type CustomerSegmentation = Awaited<ReturnType<typeof getCustomerSegmentation>>
type CustomerCohorts = Awaited<ReturnType<typeof getCustomerCohorts>>
type AtRiskCustomers = Awaited<ReturnType<typeof getAtRiskCustomers>>
type ReactivationOpportunities = Awaited<ReturnType<typeof getReactivationOpportunities>>

export type CustomerAnalyticsData = {
  salonId: string
  dateRange: {
    start: string
    end: string
  }
  insights: CustomerInsights
  segmentation: CustomerSegmentation
  cohorts: CustomerCohorts
  atRiskCustomers: AtRiskCustomers
  reactivation: ReactivationOpportunities
}

function getDefaultDateRange() {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 90)

  return {
    start: startDate.toISOString().split('T')[0]!,
    end: endDate.toISOString().split('T')[0]!,
  }
}

export async function getCustomerAnalyticsData(): Promise<CustomerAnalyticsData> {
  const { id: salonId } = await getAnalyticsSalon()
  if (!salonId) {
    throw new Error('Salon not found for analytics')
  }

  const dateRange = getDefaultDateRange()

  const [insights, segmentation, cohorts, atRiskCustomers, reactivation] = await Promise.all([
    getCustomerInsights(salonId, dateRange.start, dateRange.end),
    getCustomerSegmentation(salonId),
    getCustomerCohorts(salonId, 6),
    getAtRiskCustomers(10),
    getReactivationOpportunities(),
  ])

  return {
    salonId,
    dateRange,
    insights,
    segmentation,
    cohorts,
    atRiskCustomers,
    reactivation,
  }
}
