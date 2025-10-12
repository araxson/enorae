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

  const { data, error } = await supabase
    .rpc('check_staff_availability', {
      p_staff_id: staffId,
      p_start_time: startTime,
      p_end_time: endTime,
      p_exclude_appointment_id: excludeAppointmentId || null,
    })

  if (error) throw error
  return data as boolean
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

  const { data, error } = await supabase
    .rpc('check_appointment_conflict', {
      p_salon_id: salonId,
      p_staff_id: staffId,
      p_start_time: startTime,
      p_end_time: endTime,
      p_exclude_appointment_id: excludeAppointmentId || null,
    })

  if (error) throw error
  return data as boolean
}
