import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type TimeOffRequest = Database['public']['Views']['time_off_requests_view']['Row']

/**
 * Get all time-off requests for the manager's salon
 * SECURITY: Business users only
 */
export async function getSalonTimeOffRequests(): Promise<TimeOffRequest[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get user's salon
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) {
    throw new Error('Salon not found')
  }

  const { data, error } = await supabase
    .from('time_off_requests_view')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get pending time-off requests for the manager's salon
 * SECURITY: Business users only
 */
export async function getPendingSalonTimeOffRequests(): Promise<TimeOffRequest[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get user's salon
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) {
    throw new Error('Salon not found')
  }

  const { data, error } = await supabase
    .from('time_off_requests_view')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
