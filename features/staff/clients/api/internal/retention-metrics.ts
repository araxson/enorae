import 'server-only'
import { verifyStaffOwnership } from './auth'
import type { Appointment, ClientRetentionMetrics } from './types'

export async function getClientRetentionMetrics(staffId: string): Promise<ClientRetentionMetrics> {
  const { supabase } = await verifyStaffOwnership(staffId)

  type AppointmentSummary = Pick<Appointment, 'customer_id' | 'status'>

  const { data: appointments } = await supabase
    .from('appointments')
    .select('customer_id, status')
    .eq('staff_id', staffId)
    .returns<AppointmentSummary[]>()

  if (!appointments || appointments.length === 0) {
    return {
      total_clients: 0,
      returning_clients: 0,
      retention_rate: 0,
      avg_appointments_per_client: 0,
      loyal_clients: 0,
    }
  }

  // Count appointments per client
  const clientCounts = new Map<string, number>()
  appointments.forEach(apt => {
    if (apt.customer_id) {
      const count = clientCounts.get(apt.customer_id) || 0
      clientCounts.set(apt.customer_id, count + 1)
    }
  })

  const totalClients = clientCounts.size
  const returningClients = Array.from(clientCounts.values()).filter(count => count > 1).length
  const loyalClients = Array.from(clientCounts.values()).filter(count => count >= 5).length
  const totalAppointments = appointments.length
  const avgAppointmentsPerClient = totalClients > 0 ? totalAppointments / totalClients : 0
  const retentionRate = totalClients > 0 ? (returningClients / totalClients) * 100 : 0

  return {
    total_clients: totalClients,
    returning_clients: returningClients,
    retention_rate: retentionRate,
    avg_appointments_per_client: avgAppointmentsPerClient,
    loyal_clients: loyalClients,
  }
}
