import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments_view']['Row']
type AppointmentService = Database['public']['Views']['appointment_services_view']['Row']

export async function getCustomerAppointments(): Promise<Appointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCustomerAppointmentById(id: string): Promise<Appointment | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

export async function getAppointmentServices(appointmentId: string): Promise<AppointmentService[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // First verify the appointment belongs to this customer
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments_view')
    .select('id, customer_id')
    .eq('id', appointmentId)
    .maybeSingle<Pick<Appointment, 'id' | 'customer_id'>>()

  if (appointmentError) throw appointmentError
  if (!appointment || appointment.customer_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('appointment_services_view')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}
