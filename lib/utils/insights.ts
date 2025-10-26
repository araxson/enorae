import type {
  CustomerMetrics,
  CustomerSegment,
  CustomerSegmentation,
  InsightsSummary,
} from '@/features/business/insights/api/queries/types'

export function calculateSegment(input: {
  totalVisits: number
  lastVisitDate: string
  lifetimeValue: number
  cancellationRate: number
}): CustomerSegment {
  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(input.lastVisitDate).getTime()) /
      (1000 * 60 * 60 * 24),
  )

  if (daysSinceLastVisit > 90) return 'Churned'
  if (input.totalVisits <= 2) return 'New'
  if (input.totalVisits >= 10 && input.lifetimeValue >= 1000) return 'VIP'
  if (input.totalVisits >= 5) return 'Loyal'
  if (input.totalVisits >= 3 && (daysSinceLastVisit > 45 || input.cancellationRate > 20)) {
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
