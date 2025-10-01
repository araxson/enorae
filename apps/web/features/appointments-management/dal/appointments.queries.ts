import { createClient } from '@/lib/supabase/client'
import type { Appointment, AppointmentFilters } from '../types/appointment.types'

export async function getSalonAppointments(
  salonId: string,
  filters?: AppointmentFilters
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.date) {
    const startOfDay = new Date(filters.date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(filters.date)
    endOfDay.setHours(23, 59, 59, 999)

    query = query
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
  }

  if (filters?.staffId) {
    query = query.eq('staff_id', filters.staffId)
  }

  const { data, error } = await query.limit(100)

  if (error) throw error
  return data as Appointment[]
}

export async function getTodayAppointments(salonId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', today.toISOString())
    .lt('start_time', tomorrow.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error
  return data as Appointment[]
}

export async function getUpcomingAppointments(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', new Date().toISOString())
    .in('status', ['pending', 'confirmed'])
    .order('start_time', { ascending: true })
    .limit(50)

  if (error) throw error
  return data as Appointment[]
}