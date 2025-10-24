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
} from './api/customer-analytics'

// Churn Prediction
export {
  predictChurnRisk,
  getAtRiskCustomers,
  getReactivationOpportunities,
} from './api/churn-prediction'

// Business Insights Dashboard
export { BusinessInsights } from './components/business-insights'

// Customer Insights Dashboard
export { CustomerInsights } from './components/customer-insights'
