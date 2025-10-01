import { createClient } from '@/lib/supabase/client'
import type { Profile, Appointment } from '../types/profile.types'

export async function getCustomerProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data as Profile
}

export async function getCustomerAppointments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user.id)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as Appointment[]
}

export async function getUpcomingAppointments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error
  return data as Appointment[]
}

export async function getPastAppointments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', user.id)
    .lt('start_time', new Date().toISOString())
    .order('start_time', { ascending: false })
    .limit(20)

  if (error) throw error
  return data as Appointment[]
}