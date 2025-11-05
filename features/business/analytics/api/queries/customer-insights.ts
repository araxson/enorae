'use server'

import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { Appointment, DailyMetric } from '@/features/business/analytics/api/types'
import { createOperationLogger } from '@/lib/observability'
import { ANALYTICS_CONFIG } from '@/lib/config/constants'

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
  topCustomersLimit: number = ANALYTICS_CONFIG.TOP_CUSTOMERS_LIMIT
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
  const completedAppointments = appointments.filter(appointment => appointment['status'] === 'completed')
  /**
   * Revenue Calculation Note:
   * The appointments_view does not include total_price column. Revenue calculations
   * are currently disabled. To enable, add total_price to the view or join with
   * pricing data from the catalog schema.
   */
  const totalRevenue = 0
  const averageOrderValue = 0

  type CustomerAggregation = {
    name: string
    email?: string | null
    totalSpent: number
    visitCount: number
  }

  const customerAggregations = new Map<string, CustomerAggregation>()
  for (const appointment of completedAppointments) {
    if (!appointment['customer_id']) continue
    const existingCustomer = customerAggregations.get(appointment['customer_id']) || {
      /**
       * Customer Name Note:
       * appointments_view does not include customer name/email fields.
       * To display customer details, join with identity.profiles view.
       */
      name: 'Customer',
      email: null,
      totalSpent: 0,
      visitCount: 0,
    }
    existingCustomer.visitCount += 1
    customerAggregations.set(appointment['customer_id'], existingCustomer)
  }

  const totalCustomers = customerAggregations.size
  const averageLifetimeValue = totalCustomers ? totalRevenue / totalCustomers : 0

  const dailyMetrics = (metricsResponse.data || []) as DailyMetric[]
  const newCustomersTotal = dailyMetrics.reduce((sum, metric) => sum + (metric['new_customers'] || 0), 0)
  const returningCustomersTotal = dailyMetrics.reduce((sum, metric) => sum + (metric['returning_customers'] || 0), 0)
  const retentionDenominator = newCustomersTotal + returningCustomersTotal
  const retentionRate = retentionDenominator > 0
    ? (returningCustomersTotal / retentionDenominator) * ANALYTICS_CONFIG.PERCENTAGE_MULTIPLIER
    : 0

  const topCustomers = Array.from(customerAggregations.values())
    .sort((firstCustomer, secondCustomer) => secondCustomer.totalSpent - firstCustomer.totalSpent)
    .slice(0, topCustomersLimit)
    .map(customer => ({
      name: customer['name'],
      email: customer['email'] || undefined,
      totalSpent: customer.totalSpent,
      visitCount: customer.visitCount,
    }))

  return {
    totalCustomers,
    newCustomers: newCustomersTotal,
    returningCustomers: returningCustomersTotal,
    retentionRate,
    averageLifetimeValue,
    averageOrderValue,
    topCustomers,
  }
}
