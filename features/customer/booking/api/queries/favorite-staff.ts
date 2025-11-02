import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

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
  const favoriteStaffId = Object.entries(staffCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0]

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
  let totalDaysBetween = 0
  for (let i = 1; i < validDates.length; i++) {
    const prevItem = validDates[i - 1]
    const currItem = validDates[i]
    if (!prevItem || !currItem) continue
    const prevTime = prevItem.start_time
    const currTime = currItem.start_time
    const prevDate = new Date(prevTime)
    const currDate = new Date(currTime)
    const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    totalDaysBetween += daysDiff
  }

  return Math.round(totalDaysBetween / (validDates.length - 1))
}
