import 'server-only'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { OperatingHours } from '../types'

export async function getSalonOperatingHours(): Promise<OperatingHours[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .is('deleted_at', null)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data
}

export async function getTodayOperatingHours(): Promise<OperatingHours | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[new Date().getDay()]

  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .eq('day_of_week', today)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}