import { generateMetadata as genMeta } from '@/lib/metadata'

export const businessInsightsMetadata = genMeta({
  title: 'Business Insights',
  description: 'AI-powered insights, trend detection, and growth recommendations',
  noIndex: true,
})

// Customer Analytics
export {
  calculateCustomerLifetimeValue,
  getRetentionMetrics,
  getCustomerCohorts,
  getCustomerSegments,
  getTopCustomers,
} from './api/queries'

// Churn Prediction
export {
  predictChurnRisk,
  getAtRiskCustomers,
  getReactivationOpportunities,
} from './api/queries'

// Business Insights Dashboard
// Customer Insights Dashboard
export { BusinessInsights, CustomerInsights } from './components'
export type * from './api/types'
