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
    .eq('user_id', session.user['id'])
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
