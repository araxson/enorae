import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Appointment, ClientWithHistory, ClientDetail } from './clients-types'

export async function getStaffClients(staffId: string): Promise<ClientWithHistory[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security check
  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  // Get all appointments for this staff member
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .order('start_time', { ascending: false })

  if (error) throw error

  // Aggregate by customer
  const clientsMap = new Map<string, ClientWithHistory>()

  if (!appointments) {
    return []
  }

  appointments.forEach((appointment: Appointment) => {
    if (!appointment.customer_id) return

    const existing = clientsMap.get(appointment.customer_id)
    if (existing) {
      existing.total_appointments += 1
      // Note: appointments_view doesn't have total_price - needs to be calculated from appointment_services
      existing.total_revenue = (existing.total_revenue || 0) + 0
      if (
        appointment.start_time &&
        (!existing.last_appointment_date || appointment.start_time > existing.last_appointment_date)
      ) {
        existing.last_appointment_date = appointment.start_time
      }
    } else {
      clientsMap.set(appointment.customer_id, {
        customer_id: appointment.customer_id,
        customer_name: null, // Note: appointments_view doesn't have customer_name
        customer_email: null, // Note: appointments_view doesn't have customer_email
        total_appointments: 1,
        last_appointment_date: appointment.start_time,
        total_revenue: 0, // Note: appointments_view doesn't have total_price
      })
    }
  })

  return Array.from(clientsMap.values()).sort((a, b) => b['total_appointments'] - a['total_appointments'])
}

export async function getClientAppointmentHistory(staffId: string, customerId: string): Promise<Appointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security check
  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getClientDetail(staffId: string, customerId: string): Promise<ClientDetail | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security check
  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  // Get all appointments for this client with this staff member
  const { data: appointments } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .order('start_time', { ascending: true })

  if (!appointments || appointments.length === 0) return null

  const completed = appointments.filter((appointment: Appointment) => appointment.status === 'completed')
  const cancelled = appointments.filter((appointment: Appointment) => appointment.status === 'cancelled')

  // Note: appointments_view doesn't have total_price - needs to be calculated from appointment_services
  const totalSpent = 0

  // Note: appointments_view doesn't have service information - would need to join with appointment_services
  const favoriteServices: string[] = []

  // Calculate return rate (appointments > 1 means they returned)
  const returnRate = appointments.length > 1 ? ((appointments.length - 1) / appointments.length) * 100 : 0

  const typedAppointments = appointments as Appointment[]
  const firstAppointment = typedAppointments[0] ?? null
  const lastAppointment = typedAppointments[typedAppointments.length - 1] ?? null

  return {
    customer_id: customerId,
    customer_name: null, // Note: appointments_view doesn't have customer_name
    customer_email: null, // Note: appointments_view doesn't have customer_email
    customer_phone: null,
    total_appointments: appointments.length,
    completed_appointments: completed.length,
    cancelled_appointments: cancelled.length,
    total_spent: totalSpent,
    avg_appointment_value: completed.length > 0 ? totalSpent / completed.length : 0,
    first_appointment_date: firstAppointment?.start_time ?? null,
    last_appointment_date: lastAppointment?.start_time ?? null,
    favorite_services: favoriteServices,
    return_rate: returnRate,
    notes: null, // Would come from client_notes table
  }
}
