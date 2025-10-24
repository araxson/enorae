import 'server-only'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { BlockedTime } from '@/features/staff/blocked-times/types'

export async function getMyBlockedTimes(): Promise<BlockedTime[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blocked_times_view')
    .select('*')
    .eq('staff_id', session.user.id)
    .eq('is_active', true)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

export async function getBlockedTimeById(id: string): Promise<BlockedTime | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blocked_times_view')
    .select('*')
    .eq('id', id)
    .eq('staff_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getUpcomingBlockedTimes(): Promise<BlockedTime[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blocked_times_view')
    .select('*')
    .eq('staff_id', session.user.id)
    .eq('is_active', true)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(10)

  if (error) throw error
  return data
}
