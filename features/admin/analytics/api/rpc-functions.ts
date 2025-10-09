'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

/**
 * Get platform-wide metrics overview
 * Aggregates key statistics across all salons
 */
export async function getPlatformMetrics() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // Get counts from various tables
  const [usersResult, salonsResult, appointmentsResult, reviewsResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('salons').select('id', { count: 'exact', head: true }),
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
    supabase.from('salon_reviews').select('id', { count: 'exact', head: true }),
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
    .from('profiles')
    .select('created_at, user_id')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at')

  if (error) throw error
  if (!data) return []

  // Group by date
  const growthByDate = data.reduce((acc: Record<string, number>, profile) => {
    const date = profile.created_at?.split('T')[0] || ''
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
    .from('manual_transactions')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  if (error) throw error
  if (!data) {
    return {
      total_revenue: 0,
      transaction_count: 0,
      by_salon: {},
      by_payment_method: {},
    }
  }

  const totalRevenue = data.reduce((sum, t) => sum + (t.amount || 0), 0)
  const transactionCount = data.length

  // Group by salon
  const bySalon = data.reduce((acc: Record<string, { amount: number; count: number }>, t) => {
    const salonId = t.salon_id || 'unknown'
    if (!acc[salonId]) {
      acc[salonId] = { amount: 0, count: 0 }
    }
    acc[salonId].amount += t.amount || 0
    acc[salonId].count += 1
    return acc
  }, {})

  // Group by payment method
  const byPaymentMethod = data.reduce(
    (acc: Record<string, { amount: number; count: number }>, t) => {
      const method = t.payment_method || 'unknown'
      if (!acc[method]) {
        acc[method] = { amount: 0, count: 0 }
      }
      acc[method].amount += t.amount || 0
      acc[method].count += 1
      return acc
    },
    {}
  )

  return {
    total_revenue: totalRevenue,
    transaction_count: transactionCount,
    by_salon: bySalon,
    by_payment_method: byPaymentMethod,
  }
}

/**
 * Get salon performance rankings
 */
export async function getSalonPerformanceMetrics() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select(
      `
      id,
      name,
      rating,
      review_count,
      appointment_count,
      status
    `
    )
    .order('rating', { ascending: false })
    .limit(50)

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
    .from('appointments')
    .select('id, status, created_at, salon_id')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

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
    const status = apt.status || 'unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Group by salon
  const bySalon = data.reduce((acc: Record<string, number>, apt) => {
    const salonId = apt.salon_id || 'unknown'
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
    .from('salon_reviews')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

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
  const flaggedReviews = data.filter((r) => r.is_flagged).length
  const hiddenReviews = data.filter((r) => r.deleted_at !== null).length
  const averageRating = data.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews || 0

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
    .from('appointments')
    .select('customer_id')
    .gte('created_at', cutoffDate.toISOString())

  if (error) throw error
  if (!activeUsers) {
    return {
      active_users_count: 0,
      period_days: daysBack,
    }
  }

  const uniqueActiveUsers = new Set(activeUsers.map((a) => a.customer_id))

  return {
    active_users_count: uniqueActiveUsers.size,
    period_days: daysBack,
  }
}
