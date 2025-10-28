import 'server-only'

// Re-export all platform metrics queries
export {
  getPlatformMetrics,
  getUserGrowthMetrics,
  getRevenueMetrics,
  getSalonPerformanceMetrics,
  getAppointmentMetrics,
  getReviewMetrics,
  getActiveUserMetrics,
} from './platform'

// Re-export snapshot aggregation
export { getPlatformAnalyticsSnapshot } from './snapshot'
