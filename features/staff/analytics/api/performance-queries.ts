import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import type { AppointmentSummary, AppointmentRevenueRow } from './types'

export interface StaffPerformanceMetrics {
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  completion_rate: number
  cancellation_rate: number
  unique_customers: number
  repeat_customers: number
  total_revenue: number
  avg_appointment_value: number
  period_start: string
  period_end: string
}

export async function getStaffPerformanceMetrics(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffPerformanceMetrics> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const targetStaffId = staffProfile.id
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate || new Date().toISOString()

  // Get appointment statistics
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('id, status, customer_id, created_at')
    .eq('staff_id', targetStaffId)
    .gte('created_at', start)
    .lte('created_at', end)
    .returns<AppointmentSummary[]>()

  if (apptError) throw apptError

  const appointmentRows = appointments ?? []

  const totalAppointments = appointmentRows.length
  const completedAppointments = appointmentRows.filter(a => a.status === 'completed').length
  const cancelledAppointments = appointmentRows.filter(a => a.status === 'cancelled').length
  const noShowAppointments = appointmentRows.filter(a => a.status === 'no_show').length

  const uniqueCustomers = new Set(
    appointmentRows
      .map(a => a.customer_id)
      .filter((customerId): customerId is string => Boolean(customerId))
  ).size

  // Calculate repeat customers (customers with more than 1 appointment)
  const customerCounts = appointmentRows.reduce<Record<string, number>>((acc, a) => {
    if (!a.customer_id) return acc
    acc[a.customer_id] = (acc[a.customer_id] || 0) + 1
    return acc
  }, {})

  const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length

  // Get revenue data from appointment services
  const appointmentIds = appointmentRows
    .map(a => a.id)
    .filter((id): id is string => Boolean(id))
  let totalRevenue = 0
  if (appointmentIds.length > 0) {
    const { data: services, error: servicesError } = await supabase
      .from('appointment_services')
      .select('appointment_id, service_price, staff_id')
      .in('appointment_id', appointmentIds)
      .eq('staff_id', targetStaffId)
      .returns<AppointmentRevenueRow[]>()

    if (servicesError) throw servicesError

    totalRevenue = (services ?? []).reduce(
      (sum, service) => sum + Number(service.service_price ?? 0),
      0
    )
  }

  return {
    total_appointments: totalAppointments,
    completed_appointments: completedAppointments,
    cancelled_appointments: cancelledAppointments,
    no_show_appointments: noShowAppointments,
    completion_rate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
    cancellation_rate: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
    unique_customers: uniqueCustomers,
    repeat_customers: repeatCustomers,
    total_revenue: totalRevenue,
    avg_appointment_value: completedAppointments > 0 ? totalRevenue / completedAppointments : 0,
    period_start: start,
    period_end: end,
  }
}
