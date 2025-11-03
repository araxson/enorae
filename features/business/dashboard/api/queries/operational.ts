import 'server-only'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Appointment = Database['public']['Views']['appointments_view']['Row']
type Staff = Database['public']['Views']['staff_profiles_view']['Row']

/**
 * Get operational metrics for the salon
 */
export async function getOperationalMetrics(salonId: string) {
  const logger = createOperationLogger('getOperationalMetrics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  // Get appointments for capacity calculations
  const [appointmentsResult, staffResult] = await Promise.all([
    supabase
      .from('appointments_view')
      .select('start_time, end_time, status, created_at, staff_id')
      .eq('salon_id', salonId)
      .gte('start_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('staff_enriched_view')
      .select('id, status, is_active')
      .eq('salon_id', salonId)
      .eq('is_active', true),
  ])

  if (appointmentsResult.error || staffResult.error) {
    const error = appointmentsResult.error || staffResult.error
    if (error) {
      logger.error(
        error,
        'database',
        { query: appointmentsResult.error ? 'appointments_view' : 'staff_enriched_view' }
      )
    }
    return {
      capacityUtilization: 0,
      averageWaitTime: 5,
      staffUtilization: 0,
      appointmentsPerDay: 0,
      bookingFillRate: 0,
      peakHours: [],
    }
  }

  const appointments = (appointmentsResult.data || []) as Appointment[]
  const staff = (staffResult.data || []) as Array<{ id: string | null; status: string | null; is_active: boolean | null }>

  // Calculate appointments per day (last 30 days)
  const daysInPeriod = 30
  const appointmentsPerDay = Math.round(appointments.length / daysInPeriod)

  // Calculate peak hours
  const hourCounts = new Map<number, number>()
  appointments.forEach(apt => {
    if (apt.start_time) {
      const hour = new Date(apt.start_time).getHours()
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
    }
  })

  const sortedHours = Array.from(hourCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => {
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}${ampm}`
    })

  // Calculate staff utilization
  const totalStaff = staff.length
  const staffWithAppointments = new Set(
    appointments.filter(a => a.status === 'completed').map(a => a.staff_id)
  ).size
  const staffUtilization = totalStaff > 0
    ? Math.round((staffWithAppointments / totalStaff) * 100)
    : 0

  // Calculate capacity utilization (simplified)
  // Assume 10 hours per day, 6 days per week = 60 hours per week per staff
  const maxWeeklyHours = totalStaff * 60
  const bookedHours = appointments.filter(a => a.status !== 'cancelled').length * 1 // Assume 1 hour per appointment
  const weeklyBookedHours = bookedHours / 4 // Last 30 days ≈ 4 weeks
  const capacityUtilization = maxWeeklyHours > 0
    ? Math.min(Math.round((weeklyBookedHours / maxWeeklyHours) * 100), 100)
    : 0

  // Calculate booking fill rate
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter(a => a.status === 'completed').length
  const bookingFillRate = totalAppointments > 0
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0

  return {
    capacityUtilization,
    averageWaitTime: 5, // Default placeholder
    staffUtilization,
    appointmentsPerDay,
    bookingFillRate,
    peakHours: sortedHours,
  }
}
