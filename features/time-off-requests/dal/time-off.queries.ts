import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type TimeOffRequest = Database['public']['Views']['time_off_requests']['Row']

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
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
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
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
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
