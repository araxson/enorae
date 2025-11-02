import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

export async function calculateCustomerFavoriteStaff(
  customerId: string,
  salonId: string
): Promise<string | null> {
  const logger = createOperationLogger('calculateCustomerFavoriteStaff', {})
  logger.start()

  const session = await requireAuth()
  if (session.user.id !== customerId) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()

  // Find most frequently booked staff member
  const { data, error } = await supabase
    .from('appointments_view')
    .select('staff_id')
    .eq('customer_id', session.user.id)
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .returns<Array<{ staff_id: string | null }>>()

  if (error) throw error
  if (!data?.length) return null

  // Count occurrences of each staff member
  const staffCounts = data.reduce((acc, apt) => {
    if (apt.staff_id) {
      acc[apt.staff_id] = (acc[apt.staff_id] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Find staff with most appointments
  const STAFF_ID_INDEX = 0
  const COUNT_INDEX = 1
  const favoriteStaffId = Object.entries(staffCounts).reduce((accumulator, current) =>
    accumulator[COUNT_INDEX] > current[COUNT_INDEX] ? accumulator : current
  )[STAFF_ID_INDEX]

  return favoriteStaffId
}

export async function getCustomerVisitFrequency(
  customerId: string,
  salonId: string
): Promise<number | null> {
  const session = await requireAuth()
  if (session.user.id !== customerId) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()

  // Get completed appointments ordered by date
  const { data, error } = await supabase
    .from('appointments_view')
    .select('start_time')
    .eq('customer_id', session.user.id)
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })
    .returns<Array<{ start_time: string | null }>>()

  if (error) throw error
  if (!data || data.length < 2) return null

  const validDates: Array<{ start_time: string }> = data.filter((item): item is { start_time: string } => item.start_time !== null && item.start_time !== undefined)
  if (validDates.length < 2) return null

  // Calculate average days between consecutive visits
  const MILLISECONDS_PER_SECOND = 1000
  const SECONDS_PER_MINUTE = 60
  const MINUTES_PER_HOUR = 60
  const HOURS_PER_DAY = 24
  const MILLISECONDS_PER_DAY = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY

  let totalDaysBetween = 0
  for (let visitIndex = 1; visitIndex < validDates.length; visitIndex++) {
    const previousVisit = validDates[visitIndex - 1]
    const currentVisit = validDates[visitIndex]
    if (!previousVisit || !currentVisit) continue
    const previousTime = previousVisit.start_time
    const currentTime = currentVisit.start_time
    const previousDate = new Date(previousTime)
    const currentDate = new Date(currentTime)
    const daysDifference = Math.floor((currentDate.getTime() - previousDate.getTime()) / MILLISECONDS_PER_DAY)
    totalDaysBetween += daysDifference
  }

  return Math.round(totalDaysBetween / (validDates.length - 1))
}
