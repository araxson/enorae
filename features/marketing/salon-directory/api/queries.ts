import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type Service = Database['public']['Views']['services']['Row']

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

  // If we have search params, use the search_salons function
  if (params?.searchTerm || params?.city || params?.state) {
    const { data, error } = await supabase.rpc('search_salons', {
      search_term: params.searchTerm || null,
      city: params.city || null,
      state: params.state || null,
      is_verified_filter: params.isVerified ?? null,
      limit_count: params.limit || 50,
    })

    if (error) throw error

    // The search_salons function returns a simplified structure, so we need to fetch full details
    if (data && data.length > 0) {
      const results = data as Array<Pick<Salon, 'id'>>
      const salonIds = results.map(({ id }) => id).filter((id): id is string => Boolean(id))
      const { data: fullSalons, error: fullError } = await supabase
        .from('salons_view')
        .select('*')
        .in('id', salonIds)
        .eq('is_active', true)
        .order('rating', { ascending: false, nullsFirst: false })

      if (fullError) throw fullError
      return fullSalons as Salon[]
    }

    return []
  }

  // Default: get all active salons
  let query = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

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

  query = query.order('rating', { ascending: false, nullsFirst: false })

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
  const salonIds = [...new Set(services.map((s) => s.salon_id).filter(Boolean) as string[])]

  // Get full salon details
  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .in('id', salonIds)
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return data as Salon[]
}

/**
 * Get unique cities where salons are located
 * Public endpoint - no auth required
 */
export async function getPublicSalonCities(): Promise<{ city: string; state: string; count: number }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('city, state_province')
    .eq('is_active', true)
    .not('city', 'is', null)
    .not('state_province', 'is', null)

  if (error) throw error

  // Group by city and state
  const cityMap: Record<string, { city: string; state: string; count: number }> = {}

  data.forEach((salon) => {
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

  const { data, error } = await supabase
    .from('services_view')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null)

  if (error) throw error

  // Get unique categories
  const categories = [...new Set(data.map((s) => s.category_name).filter(Boolean) as string[])]
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
  const { data: cities, error: citiesError } = await supabase
    .from('salons_view')
    .select('city, state_province')
    .eq('is_active', true)
    .not('city', 'is', null)

  if (citiesError) throw citiesError

  const uniqueCities = new Set(cities.map((s) => `${s.city}-${s.state_province}`))

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