import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

type BlockedTime = Database['public']['Views']['blocked_times']['Row']

/**
 * Get blocked times for a salon (customer view)
 * Only shows active blocked times in the future
 */
export async function getSalonBlockedTimes(
  salonId: string,
  startDate?: Date
): Promise<BlockedTime[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const now = startDate || new Date()

  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .gte('end_time', now.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get blocked times for a specific staff member (customer view)
 * Only shows active blocked times in the future
 */
export async function getStaffBlockedTimes(
  staffId: string,
  startDate?: Date
): Promise<BlockedTime[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const now = startDate || new Date()

  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('staff_id', staffId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .gte('end_time', now.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Check if a time slot is blocked and get the reason
 */
export async function checkTimeSlotBlocked(
  staffId: string,
  startTime: string,
  endTime: string
): Promise<{ blocked: boolean; reason?: string; blockType?: string }> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blocked_times')
    .select('id, reason, block_type')
    .eq('staff_id', staffId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .lte('start_time', endTime)
    .gte('end_time', startTime)
    .maybeSingle<{ id: string; reason: string | null; block_type: string | null }>()

  if (error) throw error

  if (data) {
    return {
      blocked: true,
      reason: data.reason || undefined,
      blockType: data.block_type || undefined,
    }
  }

  return { blocked: false }
}
