'use server'

import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Appointment = Database['public']['Views']['appointments_view']['Row']

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
  const logger = createOperationLogger('getClientDetail', {})
  logger.start()

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
    .select('id, salon_id, customer_id, customer_name, staff_id, staff_name, start_time, end_time, status, total_price, created_at')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .order('start_time', { ascending: true })

  if (!appointments || appointments.length === 0) return null

  const typedAppointments = appointments as Appointment[]
  const completed = typedAppointments.filter((a: Appointment) => a.status === 'completed')
  const cancelled = typedAppointments.filter((a: Appointment) => a.status === 'cancelled')

  // Note: appointments_view doesn't have total_price - needs to be calculated from appointment_services
  const totalSpent = 0

  // Note: appointments_view doesn't have service information
  const favoriteServices: string[] = []

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
    customer_name: metadata?.full_name || null,
    customer_email: null, // Note: appointments_view doesn't have customer_email
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
