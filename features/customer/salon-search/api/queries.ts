import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { ANALYTICS_CONFIG, BUSINESS_THRESHOLDS } from '@/lib/config/constants'

type SalonViewRow = Database['public']['Views']['salons_view']['Row']
type ServiceViewRow = Database['public']['Views']['services_view']['Row']

export interface SalonSearchResult {
  id: string
  name: string
  slug: string
  address: {
    street?: string
    city?: string
    state?: string
    zip_code?: string
  } | null
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

type ServiceWithSalon = Pick<ServiceViewRow, 'id' | 'name'> & {
  salons: {
    name: string | null
    slug: string | null
    address: SalonViewRow['address']
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

  // Query salons directly using filters
  let query = supabase
    .from('salons_view')
    .select('id, name, slug, address, rating_average, is_verified, is_featured')

  if (searchTerm) {
    query = query.ilike('name', `%${searchTerm}%`)
  }
  if (isVerified !== undefined) {
    query = query.eq('is_verified', isVerified)
  }

  const { data: salons, error } = await query.limit(limit)

  if (error) throw error

  // Transform results to match expected format
  type SalonRow = {
    id: string
    name: string | null
    slug: string | null
    address: { street?: string; city?: string; state?: string; zip_code?: string } | null
    rating_average: number | null
    is_verified: boolean | null
    is_featured: boolean | null
  }

  const data = (salons || []).map((salon: SalonRow) => ({
    id: salon.id,
    name: salon.name || '',
    slug: salon.slug || '',
    address: salon.address || null,
    rating_average: salon.rating_average || 0,
    is_verified: salon.is_verified || false,
    is_featured: salon.is_featured || false,
  }))

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

  type SalonRow = {
    id: string
    name: string
    slug: string
    address: { street?: string; city?: string; state?: string; zip_code?: string } | null
    rating_average: number
    is_verified: boolean
    is_featured: boolean
  }

  // First, get all salons from public view
  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('id, name, slug, address, rating_average, is_verified, is_featured')
    .limit(100)
    .returns<SalonRow[]>()

  if (error) throw error

  // Calculate similarity for each salon using simple string matching (character-by-character comparison)
  const salonsWithSimilarity = (salons || []).map((salon: SalonRow) => {
    const searchLower = searchTerm.toLowerCase()
    const nameLower = (salon.name || '').toLowerCase()

    // Count matching characters at the same position
    let characterMatchCount = 0
    for (let charIndex = 0; charIndex < Math.min(searchLower.length, nameLower.length); charIndex++) {
      if (searchLower[charIndex] === nameLower[charIndex]) {
        characterMatchCount++
      }
    }
    const similarityScore = characterMatchCount / Math.max(searchLower.length, nameLower.length)

    return {
      ...salon,
      similarity_score: similarityScore,
    }
  })

  // Filter out low-quality matches and sort by similarity
  return salonsWithSimilarity
    .filter((salon) => salon.similarity_score > BUSINESS_THRESHOLDS.SALON_SEARCH_SIMILARITY_THRESHOLD)
    .sort((salonA, salonB) => (salonB.similarity_score || 0) - (salonA.similarity_score || 0))
    .slice(0, limit)
}

/**
 * Get search suggestions for salon names (for autocomplete)
 */
export async function getSalonSearchSuggestions(
  searchTerm: string,
  limit = ANALYTICS_CONFIG.DEFAULT_SEARCH_SUGGESTIONS_LIMIT
): Promise<{ name: string; slug: string }[]> {
  await requireAuth()

  if (!searchTerm || searchTerm.length < ANALYTICS_CONFIG.MIN_SEARCH_TERM_LENGTH) {
    return []
  }

  const supabase = await createClient()

  // Get salons that match the search term for autocomplete from public view
  const { data, error } = await supabase
    .from('salons_view')
    .select('name, slug')
    .ilike('name', `%${searchTerm}%`)
    .limit(limit)

  if (error) throw error

  return data || []
}

export async function getPopularCities(): Promise<{ city: string; count: number }[]> {
  await requireAuth()
  const supabase = await createClient()

  type SalonRow = {
    address: { city?: string } | null
  }

  // Get all salons to extract cities from public view
  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('address')
    .returns<SalonRow[]>()

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

  type SalonRow = {
    address: { state?: string } | null
  }

  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('address')
    .returns<SalonRow[]>()

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
    .from('salons_view')
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

  type SalonRow = {
    address: { city?: string } | null
  }

  // Get the salon's city from public view
  const { data: salon } = await supabase
    .from('salons_view')
    .select('address')
    .eq('id', salonId)
    .returns<SalonRow[]>()
    .single()

  if (!salon?.address?.city) {
    return []
  }

  // Find other salons in the same city using services
  const { data: services, error } = await supabase
    .from('services_view')
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
    .returns<ServiceWithSalon[]>()

  if (error) throw error

  // Filter by same city and ensure all required fields exist
  const nearbyServices = (services || [])
    .filter((service: ServiceWithSalon) => {
      // Must have id and name
      if (!service.id || !service.name) return false

      const serviceAddress = service.salons?.address
      const salonAddress = salon.address
      if (typeof serviceAddress === 'object' && serviceAddress !== null && typeof salonAddress === 'object' && salonAddress !== null) {
        return (serviceAddress as { city?: string }).city === (salonAddress as { city?: string }).city
      }
      return false
    })
    .slice(0, limit)
    .map((service: ServiceWithSalon) => ({
      id: service.id!,
      name: service.name!,
      salon_name: service.salons?.name ?? 'Unknown',
      salon_slug: service.salons?.slug ?? '',
    }))

  return nearbyServices
}
