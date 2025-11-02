import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

// Type aliases for database views
type OperationalMetric = Database['public']['Views']['operational_metrics_view']['Row']

export async function getGrowthOpportunities(salonId: string) {
  const logger = createOperationLogger('getGrowthOpportunities', {})
  logger.start()

  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get operational metrics
  const { data: operational, error: operationalError } = await supabase
    .from('operational_metrics_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(1)
    .single()

  if (operationalError) {
    logger.error(operationalError, 'database')
    console.error('[getGrowthOpportunities] Failed to fetch operational metrics:', operationalError)
    throw new Error('Failed to fetch operational metrics')
  }

  // Explicitly type the operational metric
  const typedOperational = operational as OperationalMetric | null

  const opportunities = []

  if (typedOperational?.peak_hour) {
    opportunities.push({
      type: 'scheduling',
      title: 'Optimize Peak Hour Staffing',
      description: `Peak demand is at ${typedOperational.peak_hour}:00. Ensure adequate staff coverage.`,
      potential: 'Improve revenue by 10-15%'
    })
  }

  if (typedOperational?.busiest_day_of_week !== null && typedOperational?.busiest_day_of_week !== undefined) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    opportunities.push({
      type: 'marketing',
      title: 'Target Slow Days',
      description: `${days[typedOperational.busiest_day_of_week]} is your busiest day. Create promotions for slower days.`,
      potential: 'Increase weekly bookings by 20%'
    })
  }

  return opportunities
}
