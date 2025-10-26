import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { AppointmentServiceBreakdownRow } from './types'
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

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const targetStaffId = staffProfile.id
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate || new Date().toISOString()

  const { data: appointmentServices, error } = await supabase
    .from('appointment_services')
    .select('service_id, service_name, service_price, appointment_id, staff_id, start_time, status')
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .gte('start_time', start)
    .lte('start_time', end)
    .returns<AppointmentServiceBreakdownRow[]>()

  if (error) throw error

  if (!appointmentServices || appointmentServices.length === 0) {
    return []
  }

  const revenueMap = new Map<string, { name: string; count: number; revenue: number }>()

  appointmentServices.forEach(service => {
    if (!service.service_id) return

    const price = Number(service.service_price ?? 0)
    const current = revenueMap.get(service.service_id) ?? {
      name: service.service_name ?? 'Unknown Service',
      count: 0,
      revenue: 0,
    }

    current.name = service.service_name ?? current.name
    current.count += 1
    current.revenue += price

    revenueMap.set(service.service_id, current)
  })

  return Array.from(revenueMap.entries()).map(([serviceId, data]) => ({
    service_id: serviceId,
    service_name: data.name,
    bookings_count: data.count,
    total_revenue: data.revenue,
    avg_price: data.count > 0 ? data.revenue / data.count : 0,
  }))
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
