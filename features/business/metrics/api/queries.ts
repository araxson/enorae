import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public Views for SELECT typing
type SalonMetric = Database['public']['Views']['salon_metrics']['Row']
type DailyMetric = Database['public']['Views']['daily_metrics']['Row']

export type DailyMetricWithTimestamp = DailyMetric & { metric_at: string }

export type SalonMetricsData = SalonMetric & {
  salon?: {
    id: string
    name: string
  } | null
}

/**
 * Get latest metrics for the user's salon
 */
export async function getLatestSalonMetrics(): Promise<SalonMetricsData | null> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const { data, error } = await supabase
    .from('salon_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single<SalonMetric>()

  if (error) {
    // No metrics found yet
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Get salon info
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('id', salonId)
    .single()

  return {
    ...data,
    salon,
  }
}

/**
 * Get metrics history for the user's salon
 */
export async function getSalonMetricsHistory(days = 30): Promise<SalonMetricsData[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from('salon_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('updated_at', cutoffDate.toISOString())
    .order('updated_at', { ascending: true })

  if (error) throw error

  // Get salon info
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('id', salonId)
    .single()

  return (data || []).map((metric: SalonMetric) => ({
    ...metric,
    salon,
  }))
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
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', cutoffDate.toISOString().split('T')[0])
    .order('metric_at', { ascending: true })

  if (error) throw error

  const metrics = (data ?? []) as DailyMetric[]

  return metrics.reduce<DailyMetricWithTimestamp[]>((acc, metric) => {
    if (!metric?.metric_at) {
      return acc
    }

    acc.push({ ...metric, metric_at: metric.metric_at })
    return acc
  }, [])
}