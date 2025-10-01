import { createClient } from '@/lib/supabase/client'

export async function getBlockedTimes(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blocked_times')
    .select(`
      *,
      staff_profiles(full_name)
    `)
    .eq('salon_id', salonId)
    .gte('end_time', new Date().toISOString())
    .order('start_time')

  if (error) throw error
  return data
}