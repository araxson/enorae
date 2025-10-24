import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'

type Salon = Database['public']['Views']['salons_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']
type OperatingHours = Database['public']['Views']['operating_hours_view']['Row']
type SalonContactDetails = Database['public']['Views']['salon_contact_details_view']['Row']
type SalonDescription = Database['public']['Views']['salon_descriptions_view']['Row']
type SalonMediaView = Database['public']['Views']['salon_media_view']['Row']
type LocationAddress = Database['public']['Views']['location_addresses_view']['Row']
type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']

export async function getSalons(categoryFilter?: string) {
  await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)

  // If category filter is provided, find salons offering services in that category
  if (categoryFilter) {
    const { data: servicesData } = await supabase
      .from('services_view')
      .select('salon_id, category_name')
      .eq('category_name', categoryFilter)
      .eq('is_active', true) as { data: Service[] | null; error: PostgrestError | null }

    if (servicesData && servicesData.length > 0) {
      const salonIds = [...new Set(servicesData.map((s: Service) => s.salon_id).filter(Boolean) as string[])]
      query = supabase.from('salons_view').select('*').in('id', salonIds).eq('is_active', true)
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getSalonBySlug(slug: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: Salon | null; error: PostgrestError | null }

  if (error) throw error
  return data
}

export async function searchSalons(query: string, categoryFilter?: string) {
  await requireAuth()
  const supabase = await createClient()

  let salonQuery = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)
    .ilike('name', `%${query}%`)

  // If category filter is provided, find salons offering services in that category
  if (categoryFilter) {
    const { data: servicesData } = await supabase
      .from('services_view')
      .select('salon_id, category_name')
      .eq('category_name', categoryFilter)
      .eq('is_active', true) as { data: Service[] | null; error: PostgrestError | null }

    if (servicesData && servicesData.length > 0) {
      const salonIds = [...new Set(servicesData.map((s: Service) => s.salon_id).filter(Boolean) as string[])]
      salonQuery = supabase
        .from('salons_view')
        .select('*')
        .in('id', salonIds)
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
    }
  }

  const { data, error } = await salonQuery.order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get all unique service categories
 */
export async function getServiceCategories(): Promise<string[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_categories_view')
    .select('name')
    .order('name', { ascending: true }) as { data: ServiceCategory[] | null; error: PostgrestError | null }

  if (error) throw error

  // Get unique category names
  const uniqueCategories = [
    ...new Set((data || []).map((category) => category.name).filter(Boolean) as string[]),
  ]
  return uniqueCategories
}

/**
 * Get popular categories based on service count
 */
export async function getPopularCategories(limit: number = 10): Promise<{ category: string; count: number }[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null) as { data: Service[] | null; error: PostgrestError | null }

  if (error) throw error

  // Count occurrences of each category
  const categoryCounts: Record<string, number> = {}
  ;(data || []).forEach((service) => {
    if (service.category_name) {
      categoryCounts[service.category_name] = (categoryCounts[service.category_name] || 0) + 1
    }
  })

  // Convert to array and sort by count
  const sortedCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  return sortedCategories
}

/**
 * Get operating hours for a salon
 */
export async function getSalonOperatingHours(salonId: string): Promise<OperatingHours[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operating_hours_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data as OperatingHours[]
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

  // Format time
  const formatTime = (time: string | null) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

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
    .from('salon_contact_details_view')
    .select('*')
    .eq('salon_id', salonId)
    .maybeSingle()

  if (error) throw error
  return data as SalonContactDetails | null
}

/**
 * Get salon description and details
 */
export async function getSalonDescription(salonId: string): Promise<SalonDescription | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_descriptions_view')
    .select('*')
    .eq('salon_id', salonId)
    .maybeSingle()

  if (error) throw error
  return data as SalonDescription | null
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
    .maybeSingle()

  if (error) throw error
  return data as SalonMediaView | null
}

/**
 * Get salon location address details
 */
export async function getSalonLocationAddress(locationId: string): Promise<LocationAddress | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('location_addresses_view')
    .select('*')
    .eq('location_id', locationId)
    .maybeSingle()

  if (error) throw error
  return data as LocationAddress | null
}
