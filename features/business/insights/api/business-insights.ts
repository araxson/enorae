import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

type DailyMetric = Database['analytics']['Tables']['daily_metrics']['Row']
type OperationalMetric = Database['analytics']['Tables']['operational_metrics']['Row']

export interface TrendInsight {
  metric: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  status: 'positive' | 'negative' | 'neutral'
  message: string
}

export interface BusinessRecommendation {
  id: string
  category: 'revenue' | 'efficiency' | 'customer' | 'risk'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  actionItems: string[]
}

export interface AnomalyAlert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  metric: string
  message: string
  detectedAt: string
  value: number
  expectedRange: { min: number; max: number }
}

export async function getTrendInsights(salonId: string): Promise<TrendInsight[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get last 30 days of metrics
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: metrics, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', thirtyDaysAgo.toISOString().split('T')[0])
    .order('metric_at', { ascending: true })

  if (error) throw error

  if (!metrics || metrics.length < 7) {
    return []
  }

  // Calculate trends
  const trends: TrendInsight[] = []
  const recentMetrics = metrics.slice(-7) // Last 7 days
  const previousMetrics = metrics.slice(-14, -7) // Previous 7 days

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

  return trends
}

export async function getBusinessRecommendations(salonId: string): Promise<BusinessRecommendation[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const recommendations: BusinessRecommendation[] = []

  // Get recent metrics
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: metrics } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', thirtyDaysAgo.toISOString().split('T')[0])
    .order('metric_at', { ascending: false })

  if (!metrics || metrics.length < 7) {
    return recommendations
  }

  const recentMetrics = metrics.slice(0, 7)

  // Check cancellation rate
  const totalAppts = recentMetrics.reduce((sum, m) => sum + (m.total_appointments || 0), 0)
  const cancelled = recentMetrics.reduce((sum, m) => sum + (m.cancelled_appointments || 0), 0)
  const cancellationRate = totalAppts > 0 ? (cancelled / totalAppts) * 100 : 0

  if (cancellationRate > 15) {
    recommendations.push({
      id: 'high-cancellation',
      category: 'risk',
      priority: 'high',
      title: 'High Cancellation Rate Detected',
      description: `Your cancellation rate is ${cancellationRate.toFixed(1)}%, which is above the industry average of 10-12%.`,
      impact: 'Reducing cancellations by 5% could increase monthly revenue by 8-10%',
      actionItems: [
        'Implement automated reminder system 24-48 hours before appointments',
        'Review and optimize your cancellation policy',
        'Consider requiring deposits for appointments',
        'Analyze cancellation patterns to identify peak times'
      ]
    })
  }

  // Check utilization rate
  const avgUtilization = recentMetrics.reduce((sum, m) => sum + (Number(m.utilization_rate) || 0), 0) / recentMetrics.length

  if (avgUtilization < 60) {
    recommendations.push({
      id: 'low-utilization',
      category: 'efficiency',
      priority: 'high',
      title: 'Low Staff Utilization Detected',
      description: `Your average utilization rate is ${avgUtilization.toFixed(1)}%. Optimal utilization is 70-80%.`,
      impact: 'Improving utilization to 75% could increase revenue by 15-20%',
      actionItems: [
        'Optimize staff scheduling based on peak demand hours',
        'Cross-train staff to handle multiple service types',
        'Implement dynamic pricing for off-peak hours',
        'Review service duration accuracy'
      ]
    })
  }

  // Check revenue growth
  const firstWeek = metrics.slice(-7)
  const lastWeek = metrics.slice(0, 7)
  const firstRevenue = firstWeek.reduce((sum, m) => sum + (Number(m.total_revenue) || 0), 0)
  const lastRevenue = lastWeek.reduce((sum, m) => sum + (Number(m.total_revenue) || 0), 0)
  const revenueGrowth = firstRevenue > 0 ? ((lastRevenue - firstRevenue) / firstRevenue) * 100 : 0

  if (revenueGrowth < 0) {
    recommendations.push({
      id: 'revenue-decline',
      category: 'revenue',
      priority: 'high',
      title: 'Revenue Declining',
      description: `Your revenue has decreased by ${Math.abs(revenueGrowth).toFixed(1)}% compared to last month.`,
      impact: 'Strategic interventions could recover and grow revenue by 10-15%',
      actionItems: [
        'Launch promotional campaigns to attract new customers',
        'Introduce service packages and bundles',
        'Implement loyalty programs for repeat customers',
        'Review pricing strategy and competitor analysis'
      ]
    })
  } else if (revenueGrowth > 20) {
    recommendations.push({
      id: 'scale-opportunity',
      category: 'revenue',
      priority: 'medium',
      title: 'Growth Opportunity - Consider Scaling',
      description: `Your revenue has grown by ${revenueGrowth.toFixed(1)}%. This is an excellent time to consider expansion.`,
      impact: 'Strategic scaling could accelerate growth by 25-30%',
      actionItems: [
        'Consider hiring additional staff to meet demand',
        'Evaluate opening additional locations',
        'Expand service offerings based on customer demand',
        'Invest in marketing to sustain growth momentum'
      ]
    })
  }

  // Check customer retention
  const newCustomers = recentMetrics.reduce((sum, m) => sum + (m.new_customers || 0), 0)
  const returningCustomers = recentMetrics.reduce((sum, m) => sum + (m.returning_customers || 0), 0)
  const retentionRate = (newCustomers + returningCustomers) > 0 ? (returningCustomers / (newCustomers + returningCustomers)) * 100 : 0

  if (retentionRate < 40) {
    recommendations.push({
      id: 'low-retention',
      category: 'customer',
      priority: 'high',
      title: 'Low Customer Retention',
      description: `Only ${retentionRate.toFixed(1)}% of your customers are returning. Industry standard is 50-60%.`,
      impact: 'Improving retention to 50% could increase revenue by 20-25%',
      actionItems: [
        'Implement post-appointment follow-up system',
        'Create a customer loyalty program',
        'Collect and act on customer feedback',
        'Personalize customer experience based on preferences'
      ]
    })
  }

  return recommendations
}

export async function getAnomalyAlerts(salonId: string): Promise<AnomalyAlert[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const alerts: AnomalyAlert[] = []

  // Get recent metrics with anomaly scores
  const { data: metrics } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(7)

  if (!metrics) return alerts

  // Check for anomalies
  metrics.forEach((metric) => {
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

export async function getGrowthOpportunities(salonId: string) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get operational metrics
  const { data: operational } = await supabase
    .from('operational_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(1)
    .single()

  const opportunities = []

  if (operational?.peak_hour) {
    opportunities.push({
      type: 'scheduling',
      title: 'Optimize Peak Hour Staffing',
      description: `Peak demand is at ${operational.peak_hour}:00. Ensure adequate staff coverage.`,
      potential: 'Improve revenue by 10-15%'
    })
  }

  if (operational?.busiest_day_of_week) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    opportunities.push({
      type: 'marketing',
      title: 'Target Slow Days',
      description: `${days[operational.busiest_day_of_week]} is your busiest day. Create promotions for slower days.`,
      potential: 'Increase weekly bookings by 20%'
    })
  }

  return opportunities
}
