'use server'
import 'server-only'

import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

const warnUnavailable = (fn: string, details?: Record<string, unknown>) => {
  console.warn(`[analytics] RPC "${fn}" is unavailable; returning fallback data.`, details ?? {})
}

export interface CustomerMetrics {
  total_visits: number
  total_spent: number
  lifetime_value: number
  avg_ticket: number
  last_visit_date: string | null
  first_visit_date: string | null
  favorite_service_id: string | null
  cancellation_rate: number
  no_show_rate: number
}

export async function calculateCustomerMetrics(
  customerId: string,
  salonId: string
): Promise<CustomerMetrics | null> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warnUnavailable('calculate_customer_metrics', { customerId, salonId })
  return {
    total_visits: 0,
    total_spent: 0,
    lifetime_value: 0,
    avg_ticket: 0,
    last_visit_date: null,
    first_visit_date: null,
    favorite_service_id: null,
    cancellation_rate: 0,
    no_show_rate: 0,
  }
}

export async function getCustomerRates(customerId: string, salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warnUnavailable('calculate_customer_rates', { customerId, salonId })
  return {
    cancellation_rate: 0,
    no_show_rate: 0,
  }
}

export async function getCustomerVisitStats(customerId: string, salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warnUnavailable('calculate_customer_visit_stats', { customerId, salonId })
  return {
    first_visit_date: null,
    last_visit_date: null,
    total_visits: 0,
    total_appointments: 0,
    completed_appointments: 0,
    cancelled_appointments: 0,
    no_show_appointments: 0,
  }
}

export async function getCustomerServiceStats(customerId: string, salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warnUnavailable('calculate_customer_service_stats', { customerId, salonId })
  return {
    total_services: 0,
    favorite_service_id: null,
  }
}

export async function getCustomerReviewStats(customerId: string, salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warnUnavailable('calculate_customer_review_stats', { customerId, salonId })
  return {
    review_count: 0,
    average_rating: 0,
  }
}
