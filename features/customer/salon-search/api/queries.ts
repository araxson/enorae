import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export interface SalonSearchResult {
  id: string
  name: string
  slug: string
  address: {
    street?: string
    city?: string
    state?: string
    zip_code?: string
  }
  rating_average: number
  is_verified: boolean
  is_featured: boolean
  similarity_score?: number
}

export interface SearchFilters {
  searchTerm?: string
  city?: string
  state?: string
  isVerified?: boolean
  minRating?: number
  limit?: number
}

interface ServiceWithSalon {
  id: string
  name: string | null
  salons: {
    name: string | null
    slug: string | null
    address: {
      city?: string | null
    } | null
  } | null
}

export async function searchSalons(filters: SearchFilters): Promise<SalonSearchResult[]> {
  await requireAuth()
  const supabase = await createClient()

  const {
    searchTerm,
    city,
    state,
    isVerified,
    limit = 20,
  } = filters

  // Use the search_salons RPC function
  const { data, error } = await supabase
    .rpc('search_salons', {
      search_term: searchTerm || null,
      city: city || null,
      state: state || null,
      is_verified_filter: isVerified ?? null,
      limit_count: limit,
    })

  if (error) throw error

  // Filter by rating if specified
  let results = (data ?? []) as SalonSearchResult[]
  if (filters.minRating) {
    results = results.filter((salon: SalonSearchResult) =>
      salon.rating_average >= (filters.minRating || 0)
    )
  }

  return results
}

export async function searchSalonsWithFuzzyMatch(
  searchTerm: string,
  limit = 10
): Promise<SalonSearchResult[]> {
  await requireAuth()
  const supabase = await createClient()

  // First, get all salons
  const { data: salons, error } = await supabase
    .from('salons')
    .select('id, name, slug, address, rating_average, is_verified, is_featured')
    .limit(100)

  if (error) throw error

  // Calculate similarity for each salon
  const salonsWithSimilarity = await Promise.all(
    (salons || []).map(async (salon) => {
      const { data: similarity } = await supabase
        .rpc('text_similarity', {
          text1: searchTerm.toLowerCase(),
          text2: salon.name.toLowerCase(),
        })

      return {
        ...salon,
        similarity_score: similarity || 0,
      }
    })
  )

  // Sort by similarity and return top results
  return salonsWithSimilarity
    .filter((s) => s.similarity_score > 0.1) // Filter out very low matches
    .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
    .slice(0, limit)
}

export async function getSalonSearchSuggestions(
  searchTerm: string,
  limit = 5
): Promise<{ name: string; slug: string }[]> {
  await requireAuth()

  if (!searchTerm || searchTerm.length < 2) {
    return []
  }

  const supabase = await createClient()

  // Get salons that match the search term for autocomplete
  const { data, error } = await supabase
    .from('salons')
    .select('name, slug')
    .ilike('name', `%${searchTerm}%`)
    .limit(limit)

  if (error) throw error

  return data || []
}

export async function getPopularCities(): Promise<{ city: string; count: number }[]> {
  await requireAuth()
  const supabase = await createClient()

  // Get all salons to extract cities
  const { data: salons, error } = await supabase
    .from('salons')
    .select('address')

  if (error) throw error

  // Count salons by city
  const cityCounts = new Map<string, number>()

  salons?.forEach((salon) => {
    const city = salon.address?.city
    if (city) {
      cityCounts.set(city, (cityCounts.get(city) || 0) + 1)
    }
  })

  // Convert to array and sort by count
  return Array.from(cityCounts.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export async function getAvailableStates(): Promise<string[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data: salons, error } = await supabase
    .from('salons')
    .select('address')

  if (error) throw error

  // Extract unique states
  const states = new Set<string>()

  salons?.forEach((salon) => {
    const state = salon.address?.state
    if (state) {
      states.add(state)
    }
  })

  return Array.from(states).sort()
}

export async function getFeaturedSalons(limit = 6): Promise<SalonSearchResult[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('id, name, slug, address, rating_average, is_verified, is_featured')
    .eq('is_featured', true)
    .order('rating_average', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data || []
}

export async function getNearbyServices(
  salonId: string,
  limit = 5
): Promise<{ id: string; name: string; salon_name: string; salon_slug: string }[]> {
  await requireAuth()
  const supabase = await createClient()

  // Get the salon's city
  const { data: salon } = await supabase
    .from('salons')
    .select('address')
    .eq('id', salonId)
    .single()

  if (!salon?.address?.city) {
    return []
  }

  // Find other salons in the same city
  const { data: services, error } = await supabase
    .from('services')
    .select(`
      id,
      name,
      salons:salon_id (
        name,
        slug,
        address
      )
    `)
    .neq('salon_id', salonId)
    .limit(limit * 3) // Get more to filter by city

  if (error) throw error

  // Filter by same city
  const nearbyServices = ((services || []) as unknown as ServiceWithSalon[])
    .filter((service: ServiceWithSalon) => service.salons?.address?.city === salon.address.city)
    .slice(0, limit)
    .map((service: ServiceWithSalon) => ({
      id: service.id,
      name: service.name || 'Unknown Service',
      salon_name: service.salons?.name || 'Unknown',
      salon_slug: service.salons?.slug || '',
    }))

  return nearbyServices
}