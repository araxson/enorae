import type { CustomerMetrics, InsightsSummary } from '@/features/business/insights/api/queries'

export interface CustomerInsightsDashboardProps {
  summary: InsightsSummary
  topCustomers: CustomerMetrics[]
}

export type { CustomerMetrics, InsightsSummary }
