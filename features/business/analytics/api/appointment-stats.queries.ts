import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface AppointmentStats {
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  revenue_total: number
  average_ticket: number
}

export async function getAppointmentStats(
  salonId: string,
  startDate: string,
  endDate: string
): Promise<AppointmentStats | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_appointment_stats', {
      p_salon_id: salonId,
      p_start_date: startDate,
      p_end_date: endDate,
    })
    .single()

  if (error) throw error
  return data
}
