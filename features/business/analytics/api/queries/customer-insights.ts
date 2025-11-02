import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { Appointment, DailyMetric } from '@/features/business/analytics/api/analytics.types'
import { createOperationLogger } from '@/lib/observability/logger'

export type CustomerInsights = {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  retentionRate: number
  averageLifetimeValue: number
  averageOrderValue: number
  topCustomers: { name: string; email?: string; totalSpent: number; visitCount: number }[]
}

export async function getCustomerInsights(
  salonId: string,
  startDate: string,
  endDate: string,
  topN: number = 5
): Promise<CustomerInsights> {
  const logger = createOperationLogger('getCustomerInsights', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const [appointmentsResponse, metricsResponse] = await Promise.all([
    supabase
      .from('appointments_view')
      .select('customer_id, status, start_time')
      .eq('salon_id', salonId)
      .gte('start_time', startDate)
      .lte('start_time', endDate),
    supabase
      .from('daily_metrics_view')
      .select('new_customers, returning_customers')
      .eq('salon_id', salonId)
      .gte('metric_at', startDate)
      .lte('metric_at', endDate),
  ])

  if (appointmentsResponse.error) throw appointmentsResponse.error
  if (metricsResponse.error) throw metricsResponse.error

  const appointments = (appointmentsResponse.data || []) as Appointment[]
  const completed = appointments.filter(appointment => appointment['status'] === 'completed')
  // NOTE: total_price column doesn't exist in appointments_view - revenue calculation removed
  const revenue = 0
  const averageOrderValue = 0

  type CustomerAgg = {
    name: string
    email?: string | null
    totalSpent: number
    visitCount: number
  }

  const customers = new Map<string, CustomerAgg>()
  for (const appointment of completed) {
    if (!appointment['customer_id']) continue
    const existing = customers.get(appointment['customer_id']) || {
      name: 'Customer', // customer_name doesn't exist in appointments_view
      email: null, // customer_email doesn't exist in appointments_view
      totalSpent: 0,
      visitCount: 0,
    }
    existing.visitCount += 1
    customers.set(appointment['customer_id'], existing)
  }

  const totalCustomers = customers.size
  const averageLifetimeValue = totalCustomers ? revenue / totalCustomers : 0

  const dailyMetrics = (metricsResponse.data || []) as DailyMetric[]
  const newCustomers = dailyMetrics.reduce((sum, metric) => sum + (metric['new_customers'] || 0), 0)
  const returningCustomers = dailyMetrics.reduce((sum, metric) => sum + (metric['returning_customers'] || 0), 0)
  const retentionDenominator = newCustomers + returningCustomers
  const retentionRate = retentionDenominator > 0
    ? (returningCustomers / retentionDenominator) * 100
    : 0

  const topCustomers = Array.from(customers.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, topN)
    .map(customer => ({
      name: customer['name'],
      email: customer['email'] || undefined,
      totalSpent: customer.totalSpent,
      visitCount: customer.visitCount,
    }))

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    retentionRate,
    averageLifetimeValue,
    averageOrderValue,
    topCustomers,
  }
}
