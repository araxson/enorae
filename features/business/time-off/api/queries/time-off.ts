import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type TimeOffRequest = Database['public']['Views']['time_off_requests_view']['Row']

/**
 * Get all time-off requests for the manager's salon
 * SECURITY: Business users only
 */
export async function getSalonTimeOffRequests(): Promise<TimeOffRequest[]> {
  const logger = createOperationLogger('getSalonTimeOffRequests', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('time_off_requests_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get pending time-off requests for the manager's salon
 * SECURITY: Business users only
 */
export async function getPendingSalonTimeOffRequests(): Promise<TimeOffRequest[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('time_off_requests_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}