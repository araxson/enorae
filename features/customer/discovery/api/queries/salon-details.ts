import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type OperatingHours = Database['public']['Views']['operating_hours_view']['Row']
type SalonContactDetails = Database['public']['Views']['salon_contact_details_view']['Row']
type SalonDescription = Database['public']['Views']['salon_descriptions_view']['Row']
type SalonMediaView = Database['public']['Views']['salon_media_view']['Row']
type LocationAddress = Database['public']['Views']['location_addresses_view']['Row']

export async function getSalonOperatingHours(salonId: string): Promise<OperatingHours[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operating_hours_view')
    .select('id, salon_id, day_of_week, open_time, close_time, is_closed, created_at, updated_at')
    .eq('salon_id', salonId)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data as OperatingHours[]
}

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

  const todayHours = hours.find(h => h['day_of_week'] === dayMap[today])

  if (!todayHours) return 'Hours not available'
  if (todayHours['is_closed']) return 'Closed today'

  // Format time
  const formatTime = (time: string | null | undefined) => {
    if (!time) return ''
    const parts = time.split(':')
    if (parts.length < 2) return time
    const hours = parts[0] ?? ''
    const minutes = parts[1] ?? ''
    const hour = parseInt(hours || '0')
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const openTime = formatTime(todayHours['open_time'])
  const closeTime = formatTime(todayHours['close_time'])

  return `${openTime} - ${closeTime}`
}

export async function getSalonContactDetails(salonId: string): Promise<SalonContactDetails | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_contact_details_view')
    .select('salon_id, primary_phone, secondary_phone, email, website, social_media, created_at, updated_at')
    .eq('salon_id', salonId)
    .maybeSingle()

  if (error) throw error
  return data as SalonContactDetails | null
}

export async function getSalonDescription(salonId: string): Promise<SalonDescription | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_descriptions_view')
    .select('salon_id, short_description, long_description, amenities, specialties, created_at, updated_at')
    .eq('salon_id', salonId)
    .maybeSingle()

  if (error) throw error
  return data as SalonDescription | null
}

export async function getSalonMedia(salonId: string): Promise<SalonMediaView | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_media_view')
    .select('salon_id, logo_url, cover_image_url, gallery_images, created_at, updated_at')
    .eq('salon_id', salonId)
    .maybeSingle()

  if (error) throw error
  return data as SalonMediaView | null
}

export async function getSalonLocationAddress(locationId: string): Promise<LocationAddress | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('location_addresses_view')
    .select('location_id, street_address, city, state, postal_code, country, formatted_address, latitude, longitude, created_at, updated_at')
    .eq('location_id', locationId)
    .maybeSingle()

  if (error) throw error
  return data as LocationAddress | null
}
