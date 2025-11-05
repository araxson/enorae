import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Appointment = Database['public']['Views']['admin_appointments_overview_view']['Row']

export async function getCustomerAppointments(): Promise<Appointment[]> {
  const logger = createOperationLogger('getCustomerAppointments', {})
  logger.start()

  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_id, customer_id, staff_id, service_id, service_name, start_time, end_time, status, price, created_at, updated_at')
    .eq('customer_id', session.user.id)
    .order('start_time', { ascending: false })
    .returns<Appointment[]>()

  if (error) throw error
  return data || []
}

export async function getCustomerAppointmentById(id: string): Promise<Appointment | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_id, customer_id, staff_id, service_id, service_name, start_time, end_time, status, price, created_at, updated_at')
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .maybeSingle<Appointment>()

  if (error) {
    throw error
  }

  return data
}

// Note: Service information is now included in admin_appointments_overview_view
// via the service_name field. No separate query needed.


export async function getAppointmentServices(appointmentId: string): Promise<Array<{ id: string | null; salon_id: string | null; customer_id: string | null; staff_id: string | null; service_id: string | null; start_time: string | null; end_time: string | null; status: string | null; price: number | null }>> {
  const supabase = await createClient()
  
  // Get appointment details which includes service information
  const { data, error } = await supabase
    .from("appointments_view")
    .select("id, salon_id, customer_id, staff_id, service_id, start_time, end_time, status, price")
    .eq("id", appointmentId)
    .single()

  if (error) throw error
  
  return data ? [data] : []
}
