import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

/**
 * Calculate daily metrics for a salon
 * Uses: analytics.calculate_daily_metrics
 */
export async function calculateDailyMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { error } = await supabase.rpc('calculate_daily_metrics', {
    p_salon_id: salonId,
    p_date: date.toISOString().split('T')[0],
  })

  if (error) throw error

  return { success: true }
}

/**
 * Get daily appointment metrics
 * Uses: analytics.calculate_daily_appointment_metrics
 */
export async function getDailyAppointmentMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_daily_appointment_metrics', {
    p_salon_id: salonId,
    p_date: date.toISOString().split('T')[0],
  })

  if (error) throw error

  return data as {
    total_appointments: number
    completed_appointments: number
    cancelled_appointments: number
    no_show_appointments: number
    appointment_revenue: number
  }[]
}

/**
 * Get daily customer metrics
 * Uses: analytics.calculate_daily_customer_metrics
 */
export async function getDailyCustomerMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_daily_customer_metrics', {
    p_salon_id: salonId,
    p_date: date.toISOString().split('T')[0],
  })

  if (error) throw error

  return data as {
    new_customers: number
    returning_customers: number
    unique_customers: number
  }[]
}

/**
 * Get daily service metrics
 * Uses: analytics.calculate_daily_service_metrics
 */
export async function getDailyServiceMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_daily_service_metrics', {
    p_salon_id: salonId,
    p_date: date.toISOString().split('T')[0],
  })

  if (error) throw error

  return data as {
    services_performed: number
    avg_service_duration: string
    most_popular_service: string
    service_revenue: number
  }[]
}

/**
 * Calculate customer cohorts
 * Note: This function needs to be created in the database
 */
export async function getCustomerCohorts() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // TODO: Replace with actual RPC when available
  // const { data, error } = await supabase.rpc('calculate_customer_cohorts', {
  //   p_salon_id: salonId,
  // })

  // For now, return placeholder
  return {
    cohorts: [],
    message: 'Customer cohorts RPC not yet implemented in database',
  }
}

/**
 * Get customer retention rate
 * Note: This function needs to be created in the database
 */
export async function getRetentionRate(startDate: Date, endDate: Date) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // TODO: Replace with actual RPC when available
  // const { data, error } = await supabase.rpc('get_customer_retention_rate', {
  //   p_salon_id: salonId,
  //   p_start_date: startDate.toISOString().split('T')[0],
  //   p_end_date: endDate.toISOString().split('T')[0],
  // })

  // For now, return placeholder
  return {
    retention_rate: 0,
    message: 'Customer retention RPC not yet implemented in database',
  }
}

/**
 * Get customer-specific metrics
 * Uses: analytics.calculate_customer_metrics
 */
export async function getCustomerMetrics(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { error } = await supabase.rpc('calculate_customer_metrics', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return { success: true }
}

/**
 * Get average days between customer visits
 * Uses: analytics.calculate_avg_days_between_visits
 */
export async function getAvgDaysBetweenVisits(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_avg_days_between_visits', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return data as number
}

/**
 * Get customer's favorite staff member
 * Uses: analytics.calculate_customer_favorite_staff
 */
export async function getCustomerFavoriteStaff(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_customer_favorite_staff', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return data as string | null
}

/**
 * Get customer cancellation and no-show rates
 * Uses: analytics.calculate_customer_rates
 */
export async function getCustomerRates(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_customer_rates', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return data as {
    cancellation_rate: number
    no_show_rate: number
  }[]
}

/**
 * Get customer review statistics
 * Uses: analytics.calculate_customer_review_stats
 */
export async function getCustomerReviewStats(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_customer_review_stats', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return data as {
    review_count: number
    average_rating: number
  }[]
}

/**
 * Get customer service statistics
 * Uses: analytics.calculate_customer_service_stats
 */
export async function getCustomerServiceStats(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_customer_service_stats', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return data as {
    total_services: number
    favorite_service_id: string | null
  }[]
}

/**
 * Get customer visit statistics
 * Uses: analytics.calculate_customer_visit_stats
 */
export async function getCustomerVisitStats(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('calculate_customer_visit_stats', {
    p_customer_id: customerId,
    p_salon_id: salonId,
  })

  if (error) throw error

  return data as {
    first_visit_date: string
    last_visit_date: string
    total_visits: number
    total_appointments: number
    completed_appointments: number
    cancelled_appointments: number
    no_show_appointments: number
  }[]
}
