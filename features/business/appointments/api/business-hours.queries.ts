import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function calculateBusinessHours(
  startTime: string,
  endTime: string,
  salonId: string
): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_business_hours', {
      start_time: startTime,
      end_time: endTime,
      salon_uuid: salonId,
    })

  if (error) throw error
  return data as number
}

export async function calculateDurationMinutes(
  startTime: string,
  endTime: string
): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_duration_minutes', {
      start_time: startTime,
      end_time: endTime,
    })

  if (error) throw error
  return data as number
}
