import { createClient } from '@/lib/supabase/client'

export async function getOperatingHours(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .eq('salon_id', salonId)
    .order('day_of_week')

  if (error) throw error
  return data
}

export async function getSpecialHours(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('special_hours')
    .select('*')
    .eq('salon_id', salonId)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date')

  if (error) throw error
  return data
}