import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

// Type aliases for database views
type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']

export interface BusinessRecommendation {
  id: string
  category: 'revenue' | 'efficiency' | 'customer' | 'risk'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  actionItems: string[]
}

export async function getBusinessRecommendations(salonId: string): Promise<BusinessRecommendation[]> {
  const logger = createOperationLogger('getBusinessRecommendations', {})
  logger.start()

  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const recommendations: BusinessRecommendation[] = []

  // Get recent metrics
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: metrics, error: metricsError } = await supabase
    .from('daily_metrics_view')
    .select('*')
    .eq('salon_id', salonId)
    .gte('metric_at', thirtyDaysAgo.toISOString().split('T')[0])
    .order('metric_at', { ascending: false })

  if (metricsError) {
    logger.error(metricsError, 'database')
    console.error('[getBusinessRecommendations] Failed to fetch metrics:', metricsError)
    throw new Error('Failed to fetch business metrics')
  }

  if (!metrics || metrics.length < 7) {
    return recommendations
  }

  // Explicitly type the metrics array
  const typedMetrics = metrics as DailyMetric[]
  const recentMetrics = typedMetrics.slice(0, 7)

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
  const firstWeek = typedMetrics.slice(-7)
  const lastWeek = typedMetrics.slice(0, 7)
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
