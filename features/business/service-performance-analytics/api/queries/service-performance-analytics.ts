import 'server-only'

import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export interface ServicePerformance {
  service_id: string
  service_name: string
  total_bookings: number
  total_revenue: number
  avg_rating: number
  cancellation_rate: number
  popularity_score: number
}

const warn = (fn: string, extra?: Record<string, unknown>) => {
  console.warn(`[analytics] ${fn} analytics endpoint unavailable; returning fallback data.`, extra ?? {})
}

export async function getServicePerformance(salonId: string, dateFrom?: string, dateTo?: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_service_performance', { salonId, dateFrom, dateTo })
  return [] as ServicePerformance[]
}

export async function refreshServicePerformance(serviceId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('refresh_service_performance', { serviceId })
  return { success: false }
}

export async function getTrendingServices(_salonId: string, _limit = 5) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_trending_services')
  return []
}

export async function getServiceRevenue(_salonId: string): Promise<Record<string, number>> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_service_revenue')
  return {}
}

export async function getServiceCosts(_serviceIds: string[]): Promise<Record<string, number>> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_service_costs')
  return {}
}

export async function getServiceStaffLeaders(_salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_service_staff_leaders')
  return []
}

export async function getServicePairings(_salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_service_pairings')
  return []
}

export async function getServiceDurationAccuracy(_salonId: string, _serviceIds: string[]) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await requireUserSalonId()
  warn('get_service_duration_accuracy')
  return []
}