import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']
type Staff = Database['public']['Views']['staff']['Row']

export type StaffScheduleWithStaff = StaffSchedule & {
  staff: Staff | null
}

/**
 * Get all staff schedules for a salon
 */
export async function getStaffSchedules(salonId: string, startDate?: string, endDate?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('staff_schedules')
    .select(`
      *,
      staff:staff_id(*)
    `)
    .eq('salon_id', salonId)
    .order('work_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (startDate) {
    query.gte('work_date', startDate)
  }

  if (endDate) {
    query.lte('work_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StaffScheduleWithStaff[]
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffMemberSchedule(staffId: string, startDate?: string, endDate?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('staff_schedules')
    .select('*')
    .eq('staff_id', staffId)
    .order('work_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (startDate) {
    query.gte('work_date', startDate)
  }

  if (endDate) {
    query.lte('work_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data as StaffSchedule[]
}

/**
 * Get all staff members for a salon
 */
export async function getSalonStaff(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'active')
    .order('full_name')

  if (error) throw error
  return data as Staff[]
}

/**
 * Check for schedule conflicts
 */
export async function checkScheduleConflict(
  staffId: string,
  workDate: string,
  startTime: string,
  endTime: string,
  excludeScheduleId?: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let query = supabase
    .from('staff_schedules')
    .select('*')
    .eq('staff_id', staffId)
    .eq('work_date', workDate)
    .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`)

  if (excludeScheduleId) {
    query = query.neq('id', excludeScheduleId)
  }

  const { data, error } = await query

  if (error) throw error
  return (data?.length || 0) > 0
}

/**
 * Get salon for current user (for staff schedule)
 */
export async function getScheduleSalon() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (error || !salon) {
    throw new Error('No salon found for your account')
  }

  return salon as { id: string }
}
