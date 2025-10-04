import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type DailyMetric = Database['public']['Views']['daily_metrics']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export type DailyMetricsWithTrends = DailyMetric & {
  previousPeriod?: DailyMetric | null
  trends?: {
    revenue: number
    appointments: number
    customers: number
    utilization: number
  }
}

/**
 * Get daily metrics for a salon with date range filtering
 */
export async function getDailyMetrics(
  salonId: string,
  dateFrom: string,
  dateTo: string
): Promise<DailyMetric[]> {
  // SECURITY: Require business role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', dateFrom)
    .lte('metric_at', dateTo)
    .order('metric_at', { ascending: true })

  if (error) throw error
  return (data || []) as DailyMetric[]
}

/**
 * Get latest daily metrics for a salon
 */
export async function getLatestDailyMetric(salonId: string): Promise<DailyMetric | null> {
  // SECURITY: Require business role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as DailyMetric
}

/**
 * Get aggregated metrics for a period
 */
export async function getAggregatedMetrics(
  salonId: string,
  dateFrom: string,
  dateTo: string
): Promise<{
  totalRevenue: number
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  newCustomers: number
  returningCustomers: number
  avgUtilization: number
  serviceRevenue: number
  productRevenue: number
}> {
  // SECURITY: Require business role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (!salon || (salon as Salon).owner_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const metrics = await getDailyMetrics(salonId, dateFrom, dateTo)

  const aggregated = metrics.reduce(
    (acc, metric) => ({
      totalRevenue: acc.totalRevenue + (metric.total_revenue || 0),
      totalAppointments: acc.totalAppointments + (metric.total_appointments || 0),
      completedAppointments: acc.completedAppointments + (metric.completed_appointments || 0),
      cancelledAppointments: acc.cancelledAppointments + (metric.cancelled_appointments || 0),
      noShowAppointments: acc.noShowAppointments + (metric.no_show_appointments || 0),
      newCustomers: acc.newCustomers + (metric.new_customers || 0),
      returningCustomers: acc.returningCustomers + (metric.returning_customers || 0),
      avgUtilization: acc.avgUtilization + (metric.utilization_rate || 0),
      serviceRevenue: acc.serviceRevenue + (metric.service_revenue || 0),
      productRevenue: acc.productRevenue + (metric.product_revenue || 0),
    }),
    {
      totalRevenue: 0,
      totalAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      noShowAppointments: 0,
      newCustomers: 0,
      returningCustomers: 0,
      avgUtilization: 0,
      serviceRevenue: 0,
      productRevenue: 0,
    }
  )

  // Calculate average utilization
  if (metrics.length > 0) {
    aggregated.avgUtilization = aggregated.avgUtilization / metrics.length
  }

  return aggregated
}

/**
 * Get metrics comparison between two periods
 */
export async function getMetricsComparison(
  salonId: string,
  currentFrom: string,
  currentTo: string,
  previousFrom: string,
  previousTo: string
): Promise<{
  current: Awaited<ReturnType<typeof getAggregatedMetrics>>
  previous: Awaited<ReturnType<typeof getAggregatedMetrics>>
  trends: {
    revenue: number
    appointments: number
    customers: number
    utilization: number
  }
}> {
  const [current, previous] = await Promise.all([
    getAggregatedMetrics(salonId, currentFrom, currentTo),
    getAggregatedMetrics(salonId, previousFrom, previousTo),
  ])

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  return {
    current,
    previous,
    trends: {
      revenue: calculateTrend(current.totalRevenue, previous.totalRevenue),
      appointments: calculateTrend(current.totalAppointments, previous.totalAppointments),
      customers: calculateTrend(
        current.newCustomers + current.returningCustomers,
        previous.newCustomers + previous.returningCustomers
      ),
      utilization: calculateTrend(current.avgUtilization, previous.avgUtilization),
    },
  }
}
