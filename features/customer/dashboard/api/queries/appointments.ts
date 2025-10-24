import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { AppointmentWithDetails } from '@/features/business/appointments'

const UPCOMING_LIMIT = 5
const PAST_LIMIT = 5

export async function getUpcomingAppointments(): Promise<AppointmentWithDetails[]> {
  const session = await requireAuth()
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', session.user.id)
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(UPCOMING_LIMIT)

  if (error) throw error
  return data || []
}

export async function getPastAppointments(): Promise<AppointmentWithDetails[]> {
  const session = await requireAuth()
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', session.user.id)
    .lt('start_time', now)
    .order('start_time', { ascending: false })
    .limit(PAST_LIMIT)

  if (error) throw error
  return data || []
}
