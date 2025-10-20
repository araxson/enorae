import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type {
  OperatingHours,
  SalonContactDetails,
  SalonDescription,
  SalonMediaView,
  LocationAddress,
} from './types'
import { formatTime } from './helpers'

/**
 * Get operating hours for a salon
 */
export async function getSalonOperatingHours(salonId: string): Promise<OperatingHours[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('day_of_week', { ascending: true })
    .returns<OperatingHours[]>()

  if (error) throw error
  return data ?? []
}

/**
 * Get today's operating hours for a salon
 */
export async function getSalonTodayHours(salonId: string): Promise<string> {
  await requireAuth()
  const hours = await getSalonOperatingHours(salonId)
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

  // Map JS day (0-6, Sunday-Saturday) to PostgreSQL day_of_week enum
  const dayMap: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  }

  const todayHours = hours.find(h => h.day_of_week === dayMap[today])

  if (!todayHours) return 'Hours not available'
  if (todayHours.is_closed) return 'Closed today'

  const openTime = formatTime(todayHours.open_time)
  const closeTime = formatTime(todayHours.close_time)

  return `${openTime} - ${closeTime}`
}

/**
 * Get salon contact details
 */
export async function getSalonContactDetails(salonId: string): Promise<SalonContactDetails | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_contact_details')
    .select('*')
    .eq('salon_id', salonId)
    .maybeSingle<SalonContactDetails>()

  if (error) throw error
  return data
}

/**
 * Get salon description and details
 */
export async function getSalonDescription(salonId: string): Promise<SalonDescription | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_descriptions')
    .select('*')
    .eq('salon_id', salonId)
    .maybeSingle<SalonDescription>()

  if (error) throw error
  return data
}

/**
 * Get salon media/gallery
 */
export async function getSalonMedia(salonId: string): Promise<SalonMediaView | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_media_view')
    .select('*')
    .eq('salon_id', salonId)
    .maybeSingle<SalonMediaView>()

  if (error) throw error
  return data
}

/**
 * Get salon location address details
 */
export async function getSalonLocationAddress(locationId: string): Promise<LocationAddress | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('location_addresses')
    .select('*')
    .eq('location_id', locationId)
    .maybeSingle<LocationAddress>()

  if (error) throw error
  return data
}
