import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']

export async function getProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  return data as Profile
}

export async function getUserAppointments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      salon:salon_id(id, name, location_address, phone),
      staff:staff_id(id, full_name, title)
    `)
    .eq('customer_id', user.id)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as any[]
}
