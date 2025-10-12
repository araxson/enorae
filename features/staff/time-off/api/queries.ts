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
    .from('time_off_requests_view')
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
    .from('time_off_requests_view')
    .select('*')
    .eq('salon_id', typedStaff.salon_id)
    .eq('status', 'pending')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TimeOffRequestWithStaff[]
}

export interface TimeOffBalance {
  total_days: number
  used_days: number
  pending_days: number
  remaining_days: number
  year: number
}

export async function getTimeOffBalance(year?: number): Promise<TimeOffBalance> {
  const session = await requireAnyRole(ROLE_GROUPS.STAFF_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (!staffProfile) throw new Error('Staff profile not found')

  const currentYear = year || new Date().getFullYear()
  const startDate = `${currentYear}-01-01`
  const endDate = `${currentYear}-12-31`

  // Get all time off requests for the year
  const { data: requests } = await supabase
    .from('time_off_requests_view')
    .select('duration_days, status')
    .eq('staff_id', staffProfile.id)
    .gte('start_at', startDate)
    .lte('start_at', endDate)

  const approved = requests?.filter(r => r.status === 'approved') || []
  const pending = requests?.filter(r => r.status === 'pending') || []

  const usedDays = approved.reduce((sum, r) => sum + (r.duration_days || 0), 0)
  const pendingDays = pending.reduce((sum, r) => sum + (r.duration_days || 0), 0)

  // Default to 20 days per year (could be fetched from staff profile/salon settings)
  const totalDays = 20

  return {
    total_days: totalDays,
    used_days: usedDays,
    pending_days: pendingDays,
    remaining_days: totalDays - usedDays - pendingDays,
    year: currentYear,
  }
}

export interface TeamTimeOffCalendar {
  staff_id: string
  staff_name: string
  staff_title: string | null
  start_at: string
  end_at: string
  request_type: string
  status: string
}

export async function getTeamTimeOffCalendar(
  startDate?: string,
  endDate?: string
): Promise<TeamTimeOffCalendar[]> {
  const session = await requireAnyRole(ROLE_GROUPS.STAFF_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single()

  const typedStaff = staffProfile as { salon_id: string | null } | null
  if (!typedStaff?.salon_id) throw new Error('User salon not found')

  const start = startDate || new Date().toISOString().split('T')[0]
  const end = endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('time_off_requests_view')
    .select('staff_id, staff_name, staff_title, start_at, end_at, request_type, status')
    .eq('salon_id', typedStaff.salon_id)
    .in('status', ['approved', 'pending'])
    .gte('start_at', start)
    .lte('start_at', end)
    .order('start_at', { ascending: true })

  if (error) throw error
  return data as TeamTimeOffCalendar[]
}