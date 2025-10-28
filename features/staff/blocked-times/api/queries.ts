import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { BlockedTime } from '@/features/staff/blocked-times/types'

export async function getMyBlockedTimes(): Promise<BlockedTime[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('*')
    .eq('staff_id', user.id)
    .eq('is_active', true)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

export async function getBlockedTimeById(id: string): Promise<BlockedTime | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('*')
    .eq('id', id)
    .eq('staff_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getUpcomingBlockedTimes(): Promise<BlockedTime[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('*')
    .eq('staff_id', user.id)
    .eq('is_active', true)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(10)

  if (error) throw error
  return data
}
