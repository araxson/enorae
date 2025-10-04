import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']

export type StaffScheduleWithDetails = StaffSchedule & {
  staff_name?: string | null
  staff_title?: string | null
}

/**
 * Get all staff schedules for the salon
 */
export async function getStaffSchedules(): Promise<StaffScheduleWithDetails[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*, staff:staff_id(full_name, title)')
    .eq('salon_id', staffProfile.salon_id)
    .order('staff_id')
    .order('day_of_week')

  if (error) throw error

  return (data || []).map((schedule: StaffSchedule & { staff: { full_name: string | null; title: string | null } | null }) => ({
    ...schedule,
    staff_name: schedule.staff?.full_name || null,
    staff_title: schedule.staff?.title || null,
  })) as StaffScheduleWithDetails[]
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffSchedulesByStaffId(
  staffId: string
): Promise<StaffScheduleWithDetails[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*, staff:staff_id(full_name, title)')
    .eq('staff_id', staffId)
    .eq('salon_id', staffProfile.salon_id)
    .order('day_of_week')

  if (error) throw error

  return (data || []).map((schedule: StaffSchedule & { staff: { full_name: string | null; title: string | null } | null }) => ({
    ...schedule,
    staff_name: schedule.staff?.full_name || null,
    staff_title: schedule.staff?.title || null,
  })) as StaffScheduleWithDetails[]
}

/**
 * Get all staff members for schedule management
 */
export async function getStaffForScheduling(): Promise<
  Array<{ id: string; full_name: string | null; title: string | null }>
> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('staff')
    .select('id, full_name, title')
    .eq('salon_id', staffProfile.salon_id)
    .order('full_name')

  if (error) throw error
  return data || []
}
