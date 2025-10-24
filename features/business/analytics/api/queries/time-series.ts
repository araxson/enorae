import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { DailyMetric } from '@/features/business/analytics/api/analytics.types'

export async function getDailyMetricsTimeSeries(
  salonId: string,
  startDate: string,
  endDate: string
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const response = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .order('metric_at', { ascending: true })

  if (response.error) throw response.error

  const data: DailyMetric[] = response.data || []
  return data.map((metric) => ({
    date: metric.metric_at,
    revenue: metric.total_revenue || 0,
    serviceRevenue: metric.service_revenue || 0,
    productRevenue: metric.product_revenue || 0,
    appointments: metric.total_appointments || 0,
    completed: metric.completed_appointments || 0,
    cancelled: metric.cancelled_appointments || 0,
    newCustomers: metric.new_customers || 0,
    returningCustomers: metric.returning_customers || 0,
  }))
}

export async function getCustomerTrends(
  salonId: string,
  startDate: string,
  endDate: string
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const response = await supabase
    .from('daily_metrics')
    .select('metric_at, new_customers, returning_customers')
    .eq('salon_id', salonId)
    .gte('metric_at', startDate)
    .lte('metric_at', endDate)
    .order('metric_at', { ascending: true })

  if (response.error) throw response.error

  const data: Array<{ metric_at: string | null; new_customers: number | null; returning_customers: number | null }> = response.data || []
  return data.map(metric => ({
    date: metric.metric_at,
    newCustomers: metric.new_customers || 0,
    returningCustomers: metric.returning_customers || 0,
  }))
}
