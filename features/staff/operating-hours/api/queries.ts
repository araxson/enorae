import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { OperatingHours } from '@/features/staff/operating-hours/api/types'

export async function getSalonOperatingHours(): Promise<OperatingHours[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const { data, error } = await supabase
    .from('operating_hours_view')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data
}

export async function getTodayOperatingHours(): Promise<OperatingHours | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  const today = days[new Date().getDay()]
  if (!today) throw new Error('Invalid day')

  const { data, error } = await supabase
    .from('operating_hours_view')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .eq('day_of_week', today)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}
