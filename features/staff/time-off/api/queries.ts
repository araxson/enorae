import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type TimeOffRequest = Database['public']['Views']['time_off_requests_view']['Row']

export type TimeOffRequestWithStaff = TimeOffRequest & {
  staff: {
    id: string
    user_id: string
    profiles: {
      username: string | null
    } | null
  } | null
}

export async function getTimeOffRequests(): Promise<TimeOffRequestWithStaff[]> {
  // SECURITY: Require staff or business role
  const session = await requireAnyRole([...ROLE_GROUPS.STAFF_USERS, ...ROLE_GROUPS.BUSINESS_USERS])

  const supabase = await createClient()

  // Get user's salon with explicit filter
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single()

  const typedStaff = staffProfile as { salon_id: string | null } | null
  if (!typedStaff?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('time_off_requests')
    .select('*')
    .eq('salon_id', typedStaff.salon_id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TimeOffRequestWithStaff[]
}

export async function getPendingTimeOffRequests(): Promise<TimeOffRequestWithStaff[]> {
  // SECURITY: Require staff or business role
  const session = await requireAnyRole([...ROLE_GROUPS.STAFF_USERS, ...ROLE_GROUPS.BUSINESS_USERS])

  const supabase = await createClient()

  // Get user's salon with explicit filter
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single()

  const typedStaff = staffProfile as { salon_id: string | null } | null
  if (!typedStaff?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('time_off_requests')
    .select('*')
    .eq('salon_id', typedStaff.salon_id)
    .eq('status', 'pending')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TimeOffRequestWithStaff[]
}
