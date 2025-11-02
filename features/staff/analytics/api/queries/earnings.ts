import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getStaffPerformanceMetrics } from './performance'
import { createOperationLogger } from '@/lib/observability/logger'

export interface StaffEarningsSummary {
  total_revenue: number
  estimated_commission: number
  commission_rate: number
  completed_appointments: number
  avg_earning_per_appointment: number
  period_start: string
  period_end: string
}

export async function getStaffEarningsSummary(
  staffId?: string,
  startDate?: string,
  endDate?: string
) {
  const logger = createOperationLogger('getStaffEarningsSummary', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const targetStaffId = staffId || user.id
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate || new Date().toISOString()

  const metrics = await getStaffPerformanceMetrics(targetStaffId, start, end)

  // Calculate commission (example: 40% of revenue)
  const commissionRate = 0.40
  const estimatedCommission = metrics.total_revenue * commissionRate

  return {
    total_revenue: metrics.total_revenue,
    estimated_commission: estimatedCommission,
    commission_rate: commissionRate * 100,
    completed_appointments: metrics.completed_appointments,
    avg_earning_per_appointment: metrics.avg_appointment_value * commissionRate,
    period_start: start,
    period_end: end,
  }
}
