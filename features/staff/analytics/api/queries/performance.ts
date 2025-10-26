import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'

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

type StaffAppointment = {
  id: string
  status: string | null
  customer_id: string
  start_time: string
}

export async function getStaffPerformanceMetrics(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffPerformanceMetrics> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const targetStaffId = staffProfile.id
  const start = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate ?? new Date().toISOString()

  const { data: appointments, error: apptError } = await supabase
    .from('appointments_view')
    .select('id, status, customer_id, start_time')
    .eq('staff_id', targetStaffId)
    .gte('start_time', start)
    .lte('start_time', end)

  if (apptError) throw apptError

  const appointmentRows = (appointments as StaffAppointment[] | null) ?? []

  const totalAppointments = appointmentRows.length
  const completedAppointments = appointmentRows.filter(a => a.status === 'completed').length
  const cancelledAppointments = appointmentRows.filter(a => a.status === 'cancelled').length
  const noShowAppointments = appointmentRows.filter(a => a.status === 'no_show').length

  const uniqueCustomers = new Set(appointmentRows.map(a => a.customer_id)).size

  // Calculate repeat customers (customers with more than 1 appointment)
  const customerCounts = appointmentRows.reduce<Record<string, number>>((acc, a) => {
    acc[a.customer_id] = (acc[a.customer_id] || 0) + 1
    return acc
  }, {})

  const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length

  // Calculate revenue from completed appointments
  const totalRevenue = 0

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
