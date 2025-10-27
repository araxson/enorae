import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use organization schema Views for SELECT typing
type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']

export type DailyMetricWithTimestamp = DailyMetric & { metric_at: string }

export type SalonMetricsData = {
  salon?: {
    id: string
    name: string
  } | null | undefined
  updated_at?: string | null | undefined
  total_bookings?: number | null | undefined
  total_revenue?: number | null | undefined
  rating_average?: number | null | undefined
  rating_count?: number | null | undefined
  employee_count?: number | null | undefined
  [key: string]: unknown
}

/**
 * Get latest metrics for the user's salon
 */
export async function getLatestSalonMetrics(): Promise<SalonMetricsData | null> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // Get salon info with metrics - use alternative approach
  const { data: salon } = await supabase
    .from('salons_view')
    .select('id, name')
    .eq('id', salonId)
    .single()

  if (!salon) return null

  return {
    salon: { id: salon.id, name: salon.name },
    rating_count: 0,
  } as SalonMetricsData
}

/**
 * Get metrics history for the user's salon
 */
export async function getSalonMetricsHistory(days = 30): Promise<SalonMetricsData[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // Get salon info
  const { data: salon } = await supabase
    .from('salons_view')
    .select('id, name')
    .eq('id', salonId)
    .single()

  if (!salon) return []

  // Return basic structure for now - metrics data can be enriched later
  return [{
    salon: { id: salon.id, name: salon.name },
    rating_count: 0,
  }] as SalonMetricsData[]
}

/**
 * Get daily metrics for charts (last 30 days)
 */
export async function getDailyMetrics(days = 30): Promise<DailyMetricWithTimestamp[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // COMPLIANCE: Query public view (not schema table)
  const { data, error } = await supabase
    .from('daily_metrics_view')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', cutoffDate.toISOString().split('T')[0])
    .order('metric_at', { ascending: true })

  if (error) throw error

  const metrics = (data ?? []) as DailyMetric[]

  return metrics.reduce<DailyMetricWithTimestamp[]>((acc, metric) => {
    if (!metric?.['metric_at']) {
      return acc
    }

    acc.push({ ...metric, metric_at: metric['metric_at'] })
    return acc
  }, [])
}
