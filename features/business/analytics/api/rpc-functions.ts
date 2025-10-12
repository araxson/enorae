'use server'

import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

const logUnavailable = (fn: string, extra?: Record<string, unknown>) => {
  console.warn(
    `[analytics] RPC "${fn}" is unavailable in the current schema. Returning fallback data.`,
    extra ?? {}
  )
}

/** Calculate daily metrics for a salon (placeholder). */
export async function calculateDailyMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_daily_metrics', { date })
  return { success: false, message: 'Analytics RPC unavailable in current schema' }
}

export async function getDailyAppointmentMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_daily_appointment_metrics', { date })
  return [
    {
      total_appointments: 0,
      completed_appointments: 0,
      cancelled_appointments: 0,
      no_show_appointments: 0,
      appointment_revenue: 0,
    },
  ]
}

export async function getDailyCustomerMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_daily_customer_metrics', { date })
  return [
    {
      new_customers: 0,
      returning_customers: 0,
      unique_customers: 0,
    },
  ]
}

export async function getDailyServiceMetrics(date: Date = new Date()) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_daily_service_metrics', { date })
  return [
    {
      services_performed: 0,
      avg_service_duration: '0',
      most_popular_service: 'unknown',
      service_revenue: 0,
    },
  ]
}

export async function getCustomerCohorts() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_cohorts')
  return {
    cohorts: [],
    message: 'Customer cohorts RPC not implemented in current schema',
  }
}

export async function getRetentionRate(startDate: Date, endDate: Date) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('get_customer_retention_rate', { startDate, endDate })
  return {
    retention_rate: 0,
    message: 'Customer retention RPC not implemented in current schema',
  }
}

export async function getCustomerMetrics(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_metrics', { customerId })
  return { success: false, message: 'Analytics RPC unavailable in current schema' }
}

export async function getAvgDaysBetweenVisits(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_avg_days_between_visits', { customerId })
  return 0
}

export async function getCustomerFavoriteStaff(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_favorite_staff', { customerId })
  return null
}

export async function getCustomerRates(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_rates', { customerId })
  return [
    {
      cancellation_rate: 0,
      no_show_rate: 0,
    },
  ]
}

export async function getCustomerReviewStats(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_review_stats', { customerId })
  return [
    {
      review_count: 0,
      average_rating: 0,
    },
  ]
}

export async function getCustomerServiceStats(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_service_stats', { customerId })
  return [
    {
      total_services: 0,
      favorite_service_id: null,
    },
  ]
}

export async function getCustomerVisitStats(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  logUnavailable('calculate_customer_visit_stats', { customerId })
  return [
    {
      first_visit_date: '',
      last_visit_date: '',
      total_visits: 0,
      total_appointments: 0,
      completed_appointments: 0,
      cancelled_appointments: 0,
      no_show_appointments: 0,
    },
  ]
}
