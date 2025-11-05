import 'server-only'

import type { Database } from '@/lib/types/database.types'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import {
  buildSegmentationCounts,
  createEmptyInsightsSummary,
} from '@/features/business/insights/utils'
import type { InsightsSummary } from '../../api/types'
import { getCustomerInsights } from './customers'
import { createOperationLogger } from '@/lib/observability'

type AppointmentRow = Database['public']['Views']['appointments_view']['Row']

const CUSTOMER_SAMPLE_LIMIT = 1000

export async function getInsightsSummary(): Promise<InsightsSummary> {
  const logger = createOperationLogger('getInsightsSummary', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('customer_id, status, created_at')
    .eq('salon_id', salonId)

  if (error) throw error

  const appointmentRows = (data ?? []) as Array<
    Pick<AppointmentRow, 'customer_id' | 'status' | 'created_at'>
  >

  if (appointmentRows.length === 0) {
    return createEmptyInsightsSummary()
  }

  const metrics = await getCustomerInsights(CUSTOMER_SAMPLE_LIMIT)

  const totalCustomers = new Set(
    appointmentRows.map((row) => row.customer_id),
  ).size

  const activeCustomers = metrics.filter(
    (metric) => metric.segment !== 'Churned',
  ).length

  const totalLifetimeValue = metrics.reduce(
    (sum, metric) => sum + metric.lifetime_value,
    0,
  )

  const totalVisits = metrics.reduce(
    (sum, metric) => sum + metric.total_visits,
    0,
  )

  const avgLifetimeValue =
    totalCustomers > 0 ? totalLifetimeValue / totalCustomers : 0

  const avgVisitsPerCustomer =
    totalCustomers > 0 ? totalVisits / totalCustomers : 0

  const retentionRate =
    totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0

  const segmentation = buildSegmentationCounts(metrics)

  return {
    total_customers: totalCustomers,
    active_customers: activeCustomers,
    avg_lifetime_value: avgLifetimeValue,
    avg_visits_per_customer: avgVisitsPerCustomer,
    retention_rate: retentionRate,
    churn_rate: 100 - retentionRate,
    segmentation,
  }
}
