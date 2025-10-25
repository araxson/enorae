import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']

export interface SalonSearchParams {
  searchTerm?: string
  city?: string
  state?: string
  isVerified?: boolean
  limit?: number
}

/**
 * Get all active public salons with optional filters
 * Public endpoint - no auth required
 */
export async function getPublicSalons(params?: SalonSearchParams): Promise<Salon[]> {
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)

  // Apply search filters
  if (params?.searchTerm) {
    query = query.or(`name.ilike.%${params.searchTerm}%,short_description.ilike.%${params.searchTerm}%`)
  }
  if (params?.city) {
    query = query.ilike('city', `%${params.city}%`)
  }
  if (params?.state) {
    query = query.ilike('state_province', `%${params.state}%`)
  }
  if (params?.isVerified !== undefined) {
    query = query.eq('is_verified', params.isVerified)
  }

  query = query.order('rating_average', { ascending: false, nullsFirst: false })

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Salon[]
}

/**
 * Get salon by slug for public profile page
 * Public endpoint - no auth required
 */
export async function getPublicSalonBySlug(slug: string): Promise<Salon | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data as Salon | null
}

/**
 * Get salons by city for location pages
 * Public endpoint - no auth required
 */
export async function getPublicSalonsByCity(city: string, state?: string): Promise<Salon[]> {
  const supabase = await createClient()

  let query = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)
    .ilike('city', city)

  if (state) {
    query = query.ilike('state_province', state)
  }

  query = query.order('rating_average', { ascending: false, nullsFirst: false })

  const { data, error } = await query

  if (error) throw error
  return data as Salon[]
}

/**
 * Get salons offering specific services
 * Public endpoint - no auth required
 */
export async function getPublicSalonsByService(serviceCategory: string): Promise<Salon[]> {
  const supabase = await createClient()

  type ServiceRow = { salon_id: string | null; category_name: string | null }

  // First, find services in this category
  const { data: services, error: servicesError } = await supabase
    .from('services_view')
    .select('salon_id, category_name')
    .eq('is_active', true)
    .ilike('category_name', serviceCategory)

  if (servicesError) throw servicesError

  if (!services || services.length === 0) {
    return []
  }

  // Get unique salon IDs
  const salonIds = [...new Set(services.map((s: ServiceRow) => s.salon_id).filter(Boolean) as string[])]

  // Get full salon details
  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .in('id', salonIds)
    .eq('is_active', true)
    .order('rating_average', { ascending: false, nullsFirst: false })

  if (error) throw error
  return data as Salon[]
}

/**
 * Get unique cities where salons are located
 * Public endpoint - no auth required
 */
export async function getPublicSalonCities(): Promise<{ city: string; state: string; count: number }[]> {
  const supabase = await createClient()

  type SalonRow = { city: string | null; state_province: string | null }

  const { data, error } = await supabase
    .from('salons_view')
    .select('city, state_province')
    .eq('is_active', true)
    .not('city', 'is', null)
    .not('state_province', 'is', null)

  if (error) throw error

  // Group by city and state
  const cityMap: Record<string, { city: string; state: string; count: number }> = {}

  ;(data || []).forEach((salon: SalonRow) => {
    if (salon.city && salon.state_province) {
      const key = `${salon.city}-${salon.state_province}`
      if (!cityMap[key]) {
        cityMap[key] = {
          city: salon.city,
          state: salon.state_province,
          count: 0,
        }
      }
      cityMap[key].count++
    }
  })

  return Object.values(cityMap).sort((a, b) => b.count - a.count)
}

/**
 * Get unique service categories from all salons
 * Public endpoint - no auth required
 */
export async function getPublicServiceCategories(): Promise<string[]> {
  const supabase = await createClient()

  type ServiceRow = { category_name: string | null }

  const { data, error } = await supabase
    .from('services_view')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null)

  if (error) throw error

  // Get unique categories
  const categories = [...new Set((data || []).map((s: ServiceRow) => s.category_name).filter(Boolean) as string[])]
  return categories.sort()
}

/**
 * Get services offered by a salon
 * Public endpoint - no auth required
 */
export async function getPublicSalonServices(salonId: string): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('category_name', { ascending: true })
    .order('name', { ascending: true })
    .returns<Service[]>()

  if (error) throw error
  return data as Service[]
}

/**
 * Get platform statistics for homepage
 * Public endpoint - no auth required
 */
export async function getPublicPlatformStats(): Promise<{
  totalSalons: number
  totalCities: number
  totalServices: number
}> {
  const supabase = await createClient()

  // Count active salons
  const { count: salonCount, error: salonError } = await supabase
    .from('salons_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (salonError) throw salonError

  // Count unique cities
  type CityRow = { city: string | null; state_province: string | null }

  const { data: cities, error: citiesError } = await supabase
    .from('salons_view')
    .select('city, state_province')
    .eq('is_active', true)
    .not('city', 'is', null)

  if (citiesError) throw citiesError

  const uniqueCities = new Set((cities || []).map((s: CityRow) => `${s.city}-${s.state_province}`))

  // Count active services
  const { count: servicesCount, error: servicesError } = await supabase
    .from('services_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (servicesError) throw servicesError

  return {
    totalSalons: salonCount || 0,
    totalCities: uniqueCities.size,
    totalServices: servicesCount || 0,
  }
}
