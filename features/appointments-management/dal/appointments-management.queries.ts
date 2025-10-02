import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export type AppointmentWithRelations = Appointment & {
  customer: { id: string; full_name: string | null; email: string | null } | null
  staff: { id: string; full_name: string | null; title: string | null } | null
}

export async function getUserSalon() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getAppointments(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      customer:customer_id(id, full_name, email),
      staff:staff_id(id, full_name, title)
    `)
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as AppointmentWithRelations[]
}

export async function getAppointmentsByStatus(salonId: string, status: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', status)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as Appointment[]
}
