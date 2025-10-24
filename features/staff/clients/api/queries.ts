import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

export type ClientWithHistory = {
  customer_id: string
  customer_name: string | null
  customer_email: string | null
  total_appointments: number
  last_appointment_date: string | null
  total_revenue: number | null
}

export async function getStaffClients(staffId: string): Promise<ClientWithHistory[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security: Verify staff ownership
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

  appointments?.forEach((apt) => {
    const appointment = apt as Appointment
    if (!appointment.customer_id) return

    const existing = clientsMap.get(appointment.customer_id)
    if (existing) {
      existing.total_appointments += 1
      existing.total_revenue = (existing.total_revenue || 0) + (appointment.total_price || 0)
      if (
        appointment.start_time &&
        (!existing.last_appointment_date || appointment.start_time > existing.last_appointment_date)
      ) {
        existing.last_appointment_date = appointment.start_time
      }
    } else {
      clientsMap.set(appointment.customer_id, {
        customer_id: appointment.customer_id,
        customer_name: appointment.customer_name,
        customer_email: appointment.customer_email,
        total_appointments: 1,
        last_appointment_date: appointment.start_time,
        total_revenue: appointment.total_price || 0,
      })
    }
  })

  return Array.from(clientsMap.values()).sort((a, b) => b.total_appointments - a.total_appointments)
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
  return data || []
}

export type ClientDetail = {
  customer_id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  total_spent: number
  avg_appointment_value: number
  first_appointment_date: string | null
  last_appointment_date: string | null
  favorite_services: string[]
  return_rate: number
  notes?: string | null
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

  const typedAppointments = appointments as Appointment[]
  const completed = typedAppointments.filter(a => a.status === 'completed')
  const cancelled = typedAppointments.filter(a => a.status === 'cancelled')

  const totalSpent = completed.reduce((sum, a) => sum + (a.total_price || 0), 0)

  // Calculate favorite services
  const serviceMap = new Map<string, number>()
  completed.forEach(a => {
    if (a.service_names && Array.isArray(a.service_names)) {
      a.service_names.forEach(serviceName => {
        const count = serviceMap.get(serviceName) || 0
        serviceMap.set(serviceName, count + 1)
      })
    }
  })

  const favoriteServices = Array.from(serviceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([service]) => service)

  // Calculate return rate (appointments > 1 means they returned)
  const returnRate = appointments.length > 1 ? ((appointments.length - 1) / appointments.length) * 100 : 0

  // Get profile info from profiles_metadata which has full_name
  const { data: metadata } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .select('full_name')
    .eq('profile_id', customerId)
    .single()

  // Get staff notes about client (would need a client_notes table, using placeholder)
  // const { data: notes } = await supabase
  //   .schema('organization')
  //   .from('client_notes')
  //   .select('notes')
  //   .eq('staff_id', staffId)
  //   .eq('client_id', customerId)
  //   .single()

  return {
    customer_id: customerId,
    customer_name: metadata?.full_name || typedAppointments[0]?.customer_name || null,
    customer_email: typedAppointments[0]?.customer_email || null,
    customer_phone: null,
    total_appointments: appointments.length,
    completed_appointments: completed.length,
    cancelled_appointments: cancelled.length,
    total_spent: totalSpent,
    avg_appointment_value: completed.length > 0 ? totalSpent / completed.length : 0,
    first_appointment_date: typedAppointments[0]?.start_time || null,
    last_appointment_date: typedAppointments[typedAppointments.length - 1]?.start_time || null,
    favorite_services: favoriteServices,
    return_rate: returnRate,
    notes: null, // Would come from client_notes table
  }
}

export type ClientServiceHistory = {
  service_name: string
  times_booked: number
  total_spent: number
  avg_price: number
  last_booked: string | null
}

export async function getClientServiceHistory(staffId: string, customerId: string): Promise<ClientServiceHistory[]> {
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

  const { data: appointments } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .eq('status', 'completed')

  if (!appointments) return []

  const serviceMap = new Map<string, ClientServiceHistory>()

  appointments.forEach(apt => {
    const appointment = apt as Appointment
    const serviceNames = Array.isArray(appointment.service_names)
      ? appointment.service_names
      : ['Unknown Service']
    const price = appointment.total_price || 0

    serviceNames.forEach(serviceName => {
      const existing = serviceMap.get(serviceName)
      if (existing) {
        existing.times_booked += 1
        existing.total_spent += price
        existing.avg_price = existing.total_spent / existing.times_booked
        if (appointment.start_time && (!existing.last_booked || appointment.start_time > existing.last_booked)) {
          existing.last_booked = appointment.start_time
        }
      } else {
        serviceMap.set(serviceName, {
          service_name: serviceName,
          times_booked: 1,
          total_spent: price,
          avg_price: price,
          last_booked: appointment.start_time || null,
        })
      }
    })
  })

  return Array.from(serviceMap.values()).sort((a, b) => b.times_booked - a.times_booked)
}

export type ClientRetentionMetrics = {
  total_clients: number
  returning_clients: number
  retention_rate: number
  avg_appointments_per_client: number
  loyal_clients: number // 5+ appointments
}

export async function getClientRetentionMetrics(staffId: string): Promise<ClientRetentionMetrics> {
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

  const { data: appointments } = await supabase
    .from('appointments_view')
    .select('customer_id, status')
    .eq('staff_id', staffId)

  type AppointmentCustomer = {
    customer_id: string | null
    status: string | null
  }

  const typedAppointments = (appointments as AppointmentCustomer[]) || []

  if (typedAppointments.length === 0) {
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
  typedAppointments.forEach(apt => {
    if (apt.customer_id) {
      const count = clientCounts.get(apt.customer_id) || 0
      clientCounts.set(apt.customer_id, count + 1)
    }
  })

  const totalClients = clientCounts.size
  const returningClients = Array.from(clientCounts.values()).filter(count => count > 1).length
  const loyalClients = Array.from(clientCounts.values()).filter(count => count >= 5).length
  const totalAppointments = typedAppointments.length
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
