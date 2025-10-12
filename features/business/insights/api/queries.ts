import 'server-only'

export { getCustomerInsights } from './queries/customers'
export { getInsightsSummary } from './queries/summary'
export { getCustomersBySegment } from './queries/segments'
export type {
  CustomerMetrics,
  CustomerSegmentation,
  CustomerSegment,
  InsightsSummary,
} from './queries/types'
