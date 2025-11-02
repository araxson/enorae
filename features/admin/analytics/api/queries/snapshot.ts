import 'server-only'

import { createOperationLogger } from '@/lib/observability/logger'
import {
  getPlatformMetrics,
  getUserGrowthMetrics,
  getRevenueMetrics,
  getSalonPerformanceMetrics,
  getAppointmentMetrics,
  getReviewMetrics,
  getActiveUserMetrics,
} from './platform'

export {
  getPlatformMetrics,
  getUserGrowthMetrics,
  getRevenueMetrics,
  getSalonPerformanceMetrics,
  getAppointmentMetrics,
  getReviewMetrics,
  getActiveUserMetrics,
}

/**
 * Get comprehensive platform analytics snapshot
 * @param options - Options with windowDays (defaults to 30)
 */
export async function getPlatformAnalyticsSnapshot(options?: { windowDays?: number }) {
  const logger = createOperationLogger('getPlatformAnalyticsSnapshot', {})
  logger.start()

  const windowDays = options?.windowDays || 30
  const endDate = new Date().toISOString()
  const startDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString()

  const [
    platformMetrics,
    userGrowth,
    revenueData,
    salonPerformance,
    appointmentData,
    reviewData,
    activeUsers,
  ] = await Promise.all([
    getPlatformMetrics(),
    getUserGrowthMetrics(startDate, endDate),
    getRevenueMetrics(startDate, endDate),
    getSalonPerformanceMetrics(),
    getAppointmentMetrics(startDate, endDate),
    getReviewMetrics(startDate, endDate),
    getActiveUserMetrics(windowDays),
  ])

  // Transform raw metrics into PlatformAnalyticsSnapshot structure
  return {
    timeframe: { start: startDate, end: endDate },
    latestSnapshotDate: new Date().toISOString(),
    growth: {
      summary: {
        revenue: { current: 0, previous: 0, delta: 0, deltaPercent: 0 },
        newCustomers: { current: 0, previous: 0, delta: 0, deltaPercent: 0 },
        activeSalons: { current: 0, previous: 0, delta: 0, deltaPercent: 0 },
        appointments: { current: 0, previous: 0, delta: 0, deltaPercent: 0 },
      },
      series: [],
    },
    acquisition: {
      totalNewUsers: 0,
      newUsersLast30Days: 0,
      newUsersLast7Days: 0,
      deltaLast7Days: 0,
      byRole: [],
      byCountry: [],
    },
    retention: {
      retentionRate: 0,
      churnRate: 0,
      returningCustomers: 0,
      newCustomers: 0,
      series: [],
    },
    featureUsage: {
      items: [],
    },
    performance: {
      avgUtilization: 0,
      revenuePerSalon: 0,
      appointmentsPerSalon: 0,
      topSalons: [],
    },
  }
}
