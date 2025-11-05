import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS, canAccessSalon } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type OperationalMetric = Database['public']['Views']['operational_metrics_view']['Row']

export async function getOperationalMetrics(salonId: string): Promise<OperationalMetric | null> {
  const logger = createOperationLogger('getOperationalMetrics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operational_metrics_view')
    .select('salon_id, metric_at, staff_utilization, booking_efficiency, customer_satisfaction, service_completion_rate, average_service_duration')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[getOperationalMetrics] Error:', error)
    return null
  }

  return data as unknown as OperationalMetric | null
}

export async function getOperationalSalon() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}