// Barrel export for business analytics API
// Export queries (explicit exports to avoid conflicts with rpc-functions)
export {
  getAnalyticsSalon,
  getTopServices,
  getTopStaff,
  getChainSalonBreakdown,
  getChainRevenueComparison,
  getCustomerSegmentation,
  calculateCustomerMetrics,
  getCustomerRates,
  getCustomerVisitStats,
  getCustomerServiceStats,
  getCustomerReviewStats,
  getCustomerCohorts,
  type CustomerCohort,
  getAnalyticsOverview,
  type AnalyticsOverview,
  getAppointmentStats,
  getDailyMetricsTimeSeries,
  getCustomerTrends,
  getCustomerInsights,
  type CustomerInsights,
} from './queries'

export * from './mutations'
export * from './types'

// RPC functions (legacy/fallback)
export {
  calculateDailyMetrics,
  getDailyAppointmentMetrics,
  getDailyCustomerMetrics,
  getDailyServiceMetrics,
  getRetentionRate,
  getCustomerMetrics,
  getAvgDaysBetweenVisits,
  getCustomerFavoriteStaff,
} from './rpc-functions'
