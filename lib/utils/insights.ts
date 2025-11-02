import type {
  CustomerMetrics,
  CustomerSegment,
  CustomerSegmentation,
  InsightsSummary,
} from '@/features/business/insights/types'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
const CHURNED_THRESHOLD_DAYS = 90
const NEW_CUSTOMER_VISIT_THRESHOLD = 2
const VIP_VISIT_THRESHOLD = 10
const VIP_LIFETIME_VALUE_THRESHOLD = 1000
const LOYAL_VISIT_THRESHOLD = 5
const AT_RISK_VISIT_THRESHOLD = 3
const AT_RISK_DAYS_THRESHOLD = 45
const AT_RISK_CANCELLATION_RATE_THRESHOLD = 20

export function calculateSegment(input: {
  totalVisits: number
  lastVisitDate: string
  lifetimeValue: number
  cancellationRate: number
}): CustomerSegment {
  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(input.lastVisitDate).getTime()) / MILLISECONDS_PER_DAY,
  )

  if (daysSinceLastVisit > CHURNED_THRESHOLD_DAYS) return 'Churned'
  if (input.totalVisits <= NEW_CUSTOMER_VISIT_THRESHOLD) return 'New'
  if (input.totalVisits >= VIP_VISIT_THRESHOLD && input.lifetimeValue >= VIP_LIFETIME_VALUE_THRESHOLD) return 'VIP'
  if (input.totalVisits >= LOYAL_VISIT_THRESHOLD) return 'Loyal'
  if (input.totalVisits >= AT_RISK_VISIT_THRESHOLD && (daysSinceLastVisit > AT_RISK_DAYS_THRESHOLD || input.cancellationRate > AT_RISK_CANCELLATION_RATE_THRESHOLD)) {
    return 'At Risk'
  }

  return 'Regular'
}

export function createEmptyInsightsSummary(): InsightsSummary {
  return {
    total_customers: 0,
    active_customers: 0,
    avg_lifetime_value: 0,
    avg_visits_per_customer: 0,
    retention_rate: 0,
    churn_rate: 0,
    segmentation: {
      vip: 0,
      loyal: 0,
      regular: 0,
      at_risk: 0,
      new: 0,
      churned: 0,
    },
  }
}

export function buildSegmentationCounts(
  metrics: CustomerMetrics[],
): CustomerSegmentation {
  return {
    vip: metrics.filter((metric) => metric.segment === 'VIP').length,
    loyal: metrics.filter((metric) => metric.segment === 'Loyal').length,
    regular: metrics.filter((metric) => metric.segment === 'Regular').length,
    at_risk: metrics.filter((metric) => metric.segment === 'At Risk').length,
    new: metrics.filter((metric) => metric.segment === 'New').length,
    churned: metrics.filter((metric) => metric.segment === 'Churned').length,
  }
}

export function selectTopByLifetimeValue(
  metrics: CustomerMetrics[],
  limit: number,
): CustomerMetrics[] {
  return metrics
    .slice()
    .sort((a, b) => b.lifetime_value - a.lifetime_value)
    .slice(0, limit)
}
