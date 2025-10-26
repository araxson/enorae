import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

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

  appointments.forEach(apt => {
    const appointment = apt as Appointment
    const serviceNames = Array.isArray(appointment['service_names'])
      ? appointment['service_names']
      : ['Unknown Service']
    const price = appointment['total_price'] || 0

    serviceNames.forEach(serviceName => {
      const existing = serviceMap.get(serviceName)
      if (existing) {
        existing.times_booked += 1
        existing.total_spent += price
        existing.avg_price = existing.total_spent / existing.times_booked
        if (appointment['start_time'] && (!existing.last_booked || appointment['start_time'] > existing.last_booked)) {
          existing.last_booked = appointment['start_time']
        }
      } else {
        serviceMap.set(serviceName, {
          service_name: serviceName,
          times_booked: 1,
          total_spent: price,
          avg_price: price,
          last_booked: appointment['start_time'] || null,
        })
      }
    })
  })

  return Array.from(serviceMap.values()).sort((a, b) => b.times_booked - a.times_booked)
}
