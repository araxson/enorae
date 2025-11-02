import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type Appointment = Database['public']['Views']['admin_appointments_overview_view']['Row']

export async function getCustomerAppointments(): Promise<Appointment[]> {
  const logger = createOperationLogger('getCustomerAppointments', {})
  logger.start()

  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
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
    .from('admin_appointments_overview_view')
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

// Note: Service information is now included in admin_appointments_overview_view
// via the service_name field. No separate query needed.


export async function getAppointmentServices(appointmentId: string) {
  const supabase = await createClient()
  
  // Get appointment details which includes service information
  const { data, error } = await supabase
    .from("appointments_view")
    .select("*")
    .eq("id", appointmentId)
    .single()

  if (error) throw error
  
  return data ? [data] : []
}
