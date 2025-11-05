import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { BUSINESS_THRESHOLDS, QUERY_LIMITS } from '@/lib/config/constants'
import type { SalonSearchResult } from '../../api/types'
import { createOperationLogger } from '@/lib/observability'

export async function searchSalonsWithFuzzyMatch(
  searchTerm: string,
  limit = 10
): Promise<SalonSearchResult[]> {
  const logger = createOperationLogger('searchSalonsWithFuzzyMatch', {})
  logger.start()

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

  // PERFORMANCE FIX: Use database-level search instead of client-side fuzzy matching
  // This leverages PostgreSQL's ilike operator for efficient server-side search
  const searchPattern = `%${searchTerm}%`

  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('id, name, slug, address, rating_average, is_verified, is_featured')
    .ilike('name', searchPattern)
    .order('is_featured', { ascending: false })
    .order('rating_average', { ascending: false })
    .limit(limit)
    .returns<SalonRow[]>()

  if (error) throw error

  // Simple scoring based on match position (prefix matches score higher)
  const salonsWithSimilarity = (salons || []).map((salon: SalonRow) => {
    const nameLower = (salon.name || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()

    // Calculate similarity based on match position and length
    const startsWithMatch = nameLower.startsWith(searchLower) ? 1.0 : 0.5
    const lengthRatio = searchLower.length / nameLower.length
    const similarityScore = startsWithMatch * lengthRatio

    return {
      ...salon,
      similarity_score: similarityScore,
    }
  })

  // Sort by similarity score and return
  return salonsWithSimilarity
    .sort((salonA, salonB) => (salonB.similarity_score || 0) - (salonA.similarity_score || 0))
}

type ServiceWithSalon = {
  id: string | null
  name: string | null
  salons: {
    name: string | null
    slug: string | null
    address: { city?: string; state?: string; street?: string; zip_code?: string } | null
  } | null
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

  // PERFORMANCE FIX: Fetch salon and services in parallel to avoid waterfall
  // Before: 2 sequential queries (salon then services)
  // After: 1 parallel Promise.all (faster total time)
  const [salonResult, servicesResult] = await Promise.all([
    supabase
      .from('salons_view')
      .select('address')
      .eq('id', salonId)
      .returns<SalonRow[]>()
      .single(),
    supabase
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
  ])

  const { data: salon } = salonResult
  const { data: services, error } = servicesResult

  if (error) throw error
  if (!salon) return [] // Return empty array if salon not found

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
