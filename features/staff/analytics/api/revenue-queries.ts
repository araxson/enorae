import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getStaffPerformanceMetrics } from './performance-queries'
import { verifyStaffOwnership } from '@/lib/auth/staff'

export interface StaffRevenueBreakdown {
  service_id: string
  service_name: string
  bookings_count: number
  total_revenue: number
  avg_price: number
}

export interface StaffEarningsSummary {
  total_revenue: number
  estimated_commission: number
  commission_rate: number
  completed_appointments: number
  avg_earning_per_appointment: number
  period_start: string
  period_end: string
}

export async function getStaffRevenueBreakdown(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffRevenueBreakdown[]> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  await verifyStaffOwnership(staffId)
  // Revenue analytics require appointment pricing data, which is not exposed via public views yet.
  // Return an empty breakdown to keep API aligned with available schema.
  return []
}

export async function getStaffEarningsSummary(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffEarningsSummary> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { staffProfile } = await verifyStaffOwnership(staffId)
  const targetStaffId = staffProfile.id
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
