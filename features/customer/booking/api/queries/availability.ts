import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function checkStaffAvailability(
  staffId: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check for conflicting appointments
  let query = supabase
    .schema('scheduling')
    .from('appointments')
    .select('id')
    .eq('staff_id', staffId)
    .neq('status', 'cancelled')
    .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

  if (excludeAppointmentId) {
    query = query.neq('id', excludeAppointmentId)
  }

  const { data: appointments, error: apptError } = await query

  if (apptError) throw apptError

  // Check for blocked times
  const { data: blockedTimes, error: blockedError } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('id')
    .eq('staff_id', staffId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`)

  if (blockedError) throw blockedError

  return !appointments?.length && !blockedTimes?.length
}

export async function checkAppointmentConflict(
  salonId: string,
  staffId: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check for overlapping appointments
  let query = supabase
    .schema('scheduling')
    .from('appointments')
    .select('id')
    .eq('salon_id', salonId)
    .eq('staff_id', staffId)
    .neq('status', 'cancelled')
    .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

  if (excludeAppointmentId) {
    query = query.neq('id', excludeAppointmentId)
  }

  const { data: conflicts, error } = await query

  if (error) throw error
  return Boolean(conflicts?.length)
}
