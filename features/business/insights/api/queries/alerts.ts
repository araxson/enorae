import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

// Type aliases for database views
type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']

export interface AnomalyAlert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  metric: string
  message: string
  detectedAt: string
  value: number
  expectedRange: { min: number; max: number }
}

export async function getAnomalyAlerts(salonId: string): Promise<AnomalyAlert[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const alerts: AnomalyAlert[] = []

  // Get recent metrics with anomaly scores
  const { data: metrics } = await supabase
    .from('daily_metrics_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(7)

  if (!metrics) return alerts

  // Explicitly type the metrics array
  const typedMetrics = metrics as DailyMetric[]

  // Check for anomalies
  typedMetrics.forEach((metric) => {
    // Skip if required fields are null
    if (!metric.id || !metric.metric_at) return

    const anomalyScore = Number(metric.anomaly_score) || 0

    if (anomalyScore > 0.8) {
      alerts.push({
        id: `anomaly-${metric.id}`,
        severity: 'critical',
        metric: 'Overall Performance',
        message: `Unusual pattern detected on ${new Date(metric.metric_at).toLocaleDateString()}`,
        detectedAt: metric.metric_at,
        value: anomalyScore,
        expectedRange: { min: 0, max: 0.5 }
      })
    }

    // Check no-show rate
    const noShowRate = metric.total_appointments ? (metric.no_show_appointments || 0) / metric.total_appointments : 0
    if (noShowRate > 0.15) {
      alerts.push({
        id: `noshow-${metric.id}`,
        severity: 'warning',
        metric: 'No-Show Rate',
        message: `High no-show rate: ${(noShowRate * 100).toFixed(1)}% on ${new Date(metric.metric_at).toLocaleDateString()}`,
        detectedAt: metric.metric_at,
        value: noShowRate * 100,
        expectedRange: { min: 0, max: 10 }
      })
    }
  })

  return alerts
}
