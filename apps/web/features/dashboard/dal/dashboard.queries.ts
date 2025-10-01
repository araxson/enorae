import { createClient } from '@/lib/supabase/client'
import type { Salon, Appointment } from '../types/dashboard.types'

export async function getUserSalons() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)

  if (error) throw error
  return data as Salon[]
}

export async function getSalonAppointments(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })
    .limit(10)

  if (error) throw error
  return data as Appointment[]
}

export async function getDashboardMetrics(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Get appointments
  const { data: allAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)

  const { data: todayAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', today.toISOString())
    .lt('start_time', tomorrow.toISOString())

  const { data: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', new Date().toISOString())

  const { data: recentBookings } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalAppointments: allAppointments?.length || 0,
    todayAppointments: todayAppointments?.length || 0,
    upcomingAppointments: upcomingAppointments?.length || 0,
    recentBookings: (recentBookings || []) as Appointment[],
  }
}