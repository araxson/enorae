import 'server-only'
import { verifyStaffOwnership } from './auth'
import type { Appointment, ClientWithHistory, ClientDetail } from './types'

export async function getStaffClients(staffId: string): Promise<ClientWithHistory[]> {
  const { supabase } = await verifyStaffOwnership(staffId)

  // Get all appointments for this staff member
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .order('start_time', { ascending: false })
    .returns<Appointment[]>()

  if (error) throw error

  // Aggregate by customer
  const clientsMap = new Map<string, ClientWithHistory>()

  if (!appointments) {
    return []
  }

  appointments.forEach((appointment) => {
    if (!appointment['customer_id']) return

    const existing = clientsMap.get(appointment['customer_id'])
    if (existing) {
      existing['total_appointments'] += 1
      existing['total_revenue'] = (existing['total_revenue'] || 0) + (appointment['total_price'] || 0)
      if (
        appointment['start_time'] &&
        (!existing.last_appointment_date || appointment['start_time'] > existing.last_appointment_date)
      ) {
        existing.last_appointment_date = appointment['start_time']
      }
    } else {
      clientsMap.set(appointment['customer_id'], {
        customer_id: appointment['customer_id'],
        customer_name: appointment['customer_name'],
        customer_email: appointment['customer_email'],
        total_appointments: 1,
        last_appointment_date: appointment['start_time'],
        total_revenue: appointment['total_price'] || 0,
      })
    }
  })

  return Array.from(clientsMap.values()).sort((a, b) => b['total_appointments'] - a['total_appointments'])
}

export async function getClientAppointmentHistory(staffId: string, customerId: string): Promise<Appointment[]> {
  const { supabase } = await verifyStaffOwnership(staffId)

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .order('start_time', { ascending: false })
    .returns<Appointment[]>()

  if (error) throw error
  return data ?? []
}

export async function getClientDetail(staffId: string, customerId: string): Promise<ClientDetail | null> {
  const { supabase } = await verifyStaffOwnership(staffId)

  // Get all appointments for this client with this staff member
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .order('start_time', { ascending: true })
    .returns<Appointment[]>()

  if (!appointments || appointments.length === 0) return null

  const completed = appointments.filter((appointment) => appointment['status'] === 'completed')
  const cancelled = appointments.filter((appointment) => appointment['status'] === 'cancelled')

  const totalSpent = completed.reduce((sum, a) => sum + (a['total_price'] || 0), 0)

  // Calculate favorite services
  const serviceMap = new Map<string, number>()
  completed.forEach((appointment) => {
    const services = Array.isArray(appointment['service_names']) && appointment['service_names'].length > 0
      ? appointment['service_names']
      : appointment['service_name']
        ? [appointment['service_name']]
        : []

    services.forEach((service) => {
      const count = serviceMap.get(service) || 0
      serviceMap.set(service, count + 1)
    })
  })

  const favoriteServices = Array.from(serviceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([service]) => service)

  // Calculate return rate (appointments > 1 means they returned)
  const returnRate = appointments.length > 1 ? ((appointments.length - 1) / appointments.length) * 100 : 0

  const firstAppointment = appointments[0] ?? null
  const lastAppointment = appointments[appointments.length - 1] ?? null

  return {
    customer_id: customerId,
    customer_name: lastAppointment?.['customer_name'] ?? firstAppointment?.['customer_name'] ?? null,
    customer_email: lastAppointment?.['customer_email'] ?? firstAppointment?.['customer_email'] ?? null,
    customer_phone: null,
    total_appointments: appointments.length,
    completed_appointments: completed.length,
    cancelled_appointments: cancelled.length,
    total_spent: totalSpent,
    avg_appointment_value: completed.length > 0 ? totalSpent / completed.length : 0,
    first_appointment_date: firstAppointment?.['start_time'] ?? null,
    last_appointment_date: lastAppointment?.['start_time'] ?? null,
    favorite_services: favoriteServices,
    return_rate: returnRate,
    notes: null, // Would come from client_notes table
  }
}
