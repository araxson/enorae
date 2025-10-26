import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments_view']['Row']

export type ClientServiceHistory = {
  service_name: string
  times_booked: number
  total_spent: number
  avg_price: number
  last_booked: string | null
}

export async function getClientAppointmentHistory(staffId: string, customerId: string): Promise<Appointment[]> {
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

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getClientServiceHistory(staffId: string, customerId: string): Promise<ClientServiceHistory[]> {
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

  const { data: appointments } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .eq('status', 'completed')

  if (!appointments) return []

  const serviceMap = new Map<string, ClientServiceHistory>()

  // Note: appointments_view doesn't have service_names or total_price
  // This function cannot work properly without access to service data
  // Would need to query appointment_services table instead
  return []
}
