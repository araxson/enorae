import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

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
    .eq('user_id', session.user['id'])
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
  const completed = typedAppointments.filter(a => a['status'] === 'completed')
  const cancelled = typedAppointments.filter(a => a['status'] === 'cancelled')

  const totalSpent = completed.reduce((sum, a) => sum + (a['total_price'] || 0), 0)

  // Calculate favorite services
  const serviceMap = new Map<string, number>()
  completed.forEach(a => {
    if (a['service_names'] && Array.isArray(a['service_names'])) {
      a['service_names'].forEach(serviceName => {
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
    customer_name: metadata?.['full_name'] || typedAppointments[0]?.['customer_name'] || null,
    customer_email: typedAppointments[0]?.['customer_email'] || null,
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
