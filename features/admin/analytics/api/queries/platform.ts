import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type DailyMetricsRow = Database['public']['Views']['daily_metrics_view']['Row']
type AdminSalonRow = Database['public']['Views']['admin_salons_overview_view']['Row']
type AdminAppointmentRow = Database['public']['Views']['admin_appointments_overview_view']['Row']
type ProfileRow = Database['public']['Views']['profiles_view']['Row']
type ReviewRow = Database['public']['Views']['salon_reviews_view']['Row']

/**
 * Get platform-wide metrics overview
 * Aggregates key statistics across all salons
 */
export async function getPlatformMetrics() {
  const logger = createOperationLogger('getPlatformMetrics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // Get counts from canonical public views
  const [usersResult, salonsResult, appointmentsResult, reviewsResult] = await Promise.all([
    supabase.from('profiles_view').select('id', { count: 'exact', head: true }),
    supabase.from('salons_view').select('id', { count: 'exact', head: true }),
    supabase.from('appointments_view').select('id', { count: 'exact', head: true }),
    supabase.from('salon_reviews_view').select('id', { count: 'exact', head: true }),
  ])

  return {
    total_users: usersResult.count || 0,
    total_salons: salonsResult.count || 0,
    total_appointments: appointmentsResult.count || 0,
    total_reviews: reviewsResult.count || 0,
  }
}

/**
 * Get user growth metrics over time
 */
export async function getUserGrowthMetrics(startDate: string, endDate: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles_view')
    .select('created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at')
    .returns<ProfileRow[]>()

  if (error) throw error
  if (!data) return []

  // Group by date
  const growthByDate = data.reduce((acc: Record<string, number>, profile) => {
    const date = profile['created_at']?.split('T')[0] || ''
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(growthByDate).map(([date, count]) => ({
    date,
    new_users: count,
  }))
}

/**
 * Get revenue metrics from manual transactions
 */
export async function getRevenueMetrics(startDate: string, endDate: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('daily_metrics_view')
    .select('metric_at, salon_id, total_revenue, service_revenue, product_revenue')
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .returns<DailyMetricsRow[]>()

  if (error) throw error
  if (!data || data.length === 0) {
    return {
      total_revenue: 0,
      transaction_count: 0,
      by_salon: {},
      by_payment_method: {},
    }
  }

  const totals = data.reduce(
    (acc, metric) => {
      const service = Number(metric.service_revenue) || 0
      const product = Number(metric.product_revenue) || 0
      const total = Number(metric['total_revenue']) || service + product

      acc.total += total
      acc.count += 1

      const salonKey = metric['salon_id'] ?? 'unknown'
      if (!acc.bySalon[salonKey]) {
        acc.bySalon[salonKey] = { amount: 0, count: 0 }
      }
      acc.bySalon[salonKey].amount += total
      acc.bySalon[salonKey].count += 1

      return acc
    },
    {
      total: 0,
      count: 0,
      bySalon: {} as Record<string, { amount: number; count: number }>,
    }
  )

  return {
    total_revenue: totals.total,
    transaction_count: totals.count,
    by_salon: totals.bySalon,
    by_payment_method: {},
  }
}

/**
 * Get salon performance rankings
 */
export async function getSalonPerformanceMetrics() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_salons_overview_view')
    .select('id, name, rating_average, rating_count, total_bookings, total_revenue, subscription_tier')
    .order('rating_average', { ascending: false })
    .limit(50)
    .returns<AdminSalonRow[]>()

  if (error) throw error

  return data
}

/**
 * Get appointment metrics by status
 */
export async function getAppointmentMetrics(startDate: string, endDate: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, status, salon_id, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .returns<AdminAppointmentRow[]>()

  if (error) throw error
  if (!data) {
    return {
      total_appointments: 0,
      by_status: {},
      by_salon: {},
    }
  }

  // Group by status
  const byStatus = data.reduce((acc: Record<string, number>, apt) => {
    const status = apt['status'] || 'unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Group by salon
  const bySalon = data.reduce((acc: Record<string, number>, apt) => {
    const salonId = apt['salon_id'] || 'unknown'
    acc[salonId] = (acc[salonId] || 0) + 1
    return acc
  }, {})

  return {
    total_appointments: data.length,
    by_status: byStatus,
    by_salon: bySalon,
  }
}

/**
 * Get review metrics and moderation stats
 */
export async function getReviewMetrics(startDate: string, endDate: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .returns<ReviewRow[]>()

  if (error) throw error
  if (!data || data.length === 0) {
    return {
      total_reviews: 0,
      flagged_reviews: 0,
      hidden_reviews: 0,
      average_rating: 0,
      flagged_percentage: 0,
    }
  }

  const totalReviews = data.length
  const flaggedReviews = data.filter((r) => r['is_flagged']).length
  const hiddenReviews = 0
  const averageRating = data.reduce((sum, r) => sum + (r['rating'] || 0), 0) / totalReviews || 0

  return {
    total_reviews: totalReviews,
    flagged_reviews: flaggedReviews,
    hidden_reviews: hiddenReviews,
    average_rating: averageRating,
    flagged_percentage: (flaggedReviews / totalReviews) * 100 || 0,
  }
}

/**
 * Get active user metrics (users with recent activity)
 */
export async function getActiveUserMetrics(daysBack: number = 30) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysBack)

  const { data: activeUsers, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('customer_id')
    .gte('created_at', cutoffDate.toISOString())
    .returns<AdminAppointmentRow[]>()

  if (error) throw error
  if (!activeUsers) {
    return {
      active_users_count: 0,
      period_days: daysBack,
    }
  }

  const uniqueActiveUsers = new Set(activeUsers.map((a) => a['customer_id']))

  return {
    active_users_count: uniqueActiveUsers.size,
    period_days: daysBack,
  }
}
