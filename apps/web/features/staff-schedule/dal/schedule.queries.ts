import { createClient } from '@/lib/supabase/client'

export async function getStaffSchedules() {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon
  const { data: staff } = await supabase
    .from('staff_profiles')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  const salonId = (staff as any)?.salon_id

  // Get all staff schedules for the salon
  const { data: schedules } = await supabase
    .from('staff_schedules')
    .select(`
      id,
      staff_id,
      day_of_week,
      start_time,
      end_time,
      is_available,
      staff:staff_id (
        full_name
      )
    `)
    .eq('salon_id', salonId)
    .order('day_of_week')

  // Get time-off requests
  const { data: timeOffRequests } = await supabase
    .from('time_off_requests')
    .select(`
      id,
      staff_id,
      start_date,
      end_date,
      reason,
      status,
      staff:staff_id (
        full_name
      )
    `)
    .eq('salon_id', salonId)
    .gte('end_date', new Date().toISOString())
    .order('start_date')

  // Format the data
  const formattedSchedules = ((schedules as any) || []).map((schedule: any) => ({
    id: schedule.id,
    staff_name: schedule.staff?.full_name || 'Unknown',
    day_of_week: getDayName(schedule.day_of_week),
    start_time: formatTime(schedule.start_time),
    end_time: formatTime(schedule.end_time),
    is_available: schedule.is_available
  }))

  const formattedTimeOff = ((timeOffRequests as any) || []).map((request: any) => ({
    id: request.id,
    staff_name: request.staff?.full_name || 'Unknown',
    start_date: request.start_date,
    end_date: request.end_date,
    reason: request.reason,
    status: request.status
  }))

  return {
    schedules: formattedSchedules,
    timeOffRequests: formattedTimeOff
  }
}

function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayNumber] || 'Unknown'
}

function formatTime(time: string): string {
  if (!time) return 'Not set'
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}