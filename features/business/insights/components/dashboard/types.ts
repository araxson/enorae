import type { CustomerMetrics, InsightsSummary } from '../../api/queries'

export interface CustomerInsightsDashboardProps {
  summary: InsightsSummary
  topCustomers: CustomerMetrics[]
}

export type { CustomerMetrics, InsightsSummary }
