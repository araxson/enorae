import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

// Type aliases for database views
type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']

export interface TrendInsight {
  metric: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  status: 'positive' | 'negative' | 'neutral'
  message: string
}

export async function getTrendInsights(salonId: string): Promise<TrendInsight[]> {
  const logger = createOperationLogger('getTrendInsights', {})
  logger.start()

  try {
    const session = await verifySession()
    if (!session) throw new Error('Unauthorized')

    const supabase = await createClient()

    // Get last 30 days of metrics
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: metrics, error } = await supabase
      .from('daily_metrics_view')
      .select('salon_id, metric_at, total_revenue, service_revenue, total_appointments, completed_appointments, cancelled_appointments, new_customers, returning_customers, active_staff_count, created_at')
      .eq('salon_id', salonId)
      .gte('metric_at', thirtyDaysAgo.toISOString().split('T')[0])
      .order('metric_at', { ascending: true })

    if (error) throw error

    if (!metrics || metrics.length < 7) {
      logger.success({ salonId, trendCount: 0 })
      return []
    }

  // Explicitly type the metrics array
  const typedMetrics = metrics as DailyMetric[]

  // Calculate trends
  const trends: TrendInsight[] = []
  const recentMetrics = typedMetrics.slice(-7) // Last 7 days
  const previousMetrics = typedMetrics.slice(-14, -7) // Previous 7 days

  // Revenue trend
  const recentRevenue = recentMetrics.reduce((sum, m) => sum + (Number(m.total_revenue) || 0), 0)
  const previousRevenue = previousMetrics.reduce((sum, m) => sum + (Number(m.total_revenue) || 0), 0)
  const revenueChange = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0

  trends.push({
    metric: 'Revenue',
    trend: revenueChange > 5 ? 'up' : revenueChange < -5 ? 'down' : 'stable',
    changePercent: Math.abs(revenueChange),
    status: revenueChange > 0 ? 'positive' : revenueChange < -10 ? 'negative' : 'neutral',
    message: `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}% vs previous week`
  })

  // Appointment completion trend
  const recentCompleted = recentMetrics.reduce((sum, m) => sum + (m.completed_appointments || 0), 0)
  const recentTotal = recentMetrics.reduce((sum, m) => sum + (m.total_appointments || 0), 0)
  const previousCompleted = previousMetrics.reduce((sum, m) => sum + (m.completed_appointments || 0), 0)
  const previousTotal = previousMetrics.reduce((sum, m) => sum + (m.total_appointments || 0), 0)

  const recentCompletionRate = recentTotal > 0 ? (recentCompleted / recentTotal) * 100 : 0
  const previousCompletionRate = previousTotal > 0 ? (previousCompleted / previousTotal) * 100 : 0
  const completionChange = recentCompletionRate - previousCompletionRate

  trends.push({
    metric: 'Completion Rate',
    trend: completionChange > 2 ? 'up' : completionChange < -2 ? 'down' : 'stable',
    changePercent: Math.abs(completionChange),
    status: completionChange > 0 ? 'positive' : completionChange < -5 ? 'negative' : 'neutral',
    message: `${completionChange > 0 ? '+' : ''}${completionChange.toFixed(1)}% completion rate`
  })

  // Customer retention
  const recentNew = recentMetrics.reduce((sum, m) => sum + (m.new_customers || 0), 0)
  const recentReturning = recentMetrics.reduce((sum, m) => sum + (m.returning_customers || 0), 0)
  const retentionRate = (recentNew + recentReturning) > 0 ? (recentReturning / (recentNew + recentReturning)) * 100 : 0

  trends.push({
    metric: 'Customer Retention',
    trend: retentionRate > 60 ? 'up' : retentionRate < 40 ? 'down' : 'stable',
    changePercent: retentionRate,
    status: retentionRate > 60 ? 'positive' : retentionRate < 40 ? 'negative' : 'neutral',
    message: `${retentionRate.toFixed(1)}% returning customers`
  })

    logger.success({ salonId, trendCount: trends.length })
    return trends
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return []
  }
}
