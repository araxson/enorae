import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { BUSINESS_THRESHOLDS, QUERY_LIMITS } from '@/lib/config/constants'
import type { SalonSearchResult } from '../../types'
import { createOperationLogger } from '@/lib/observability/logger'

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

  // First, get all salons from public view
  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('id, name, slug, address, rating_average, is_verified, is_featured')
    .limit(QUERY_LIMITS.MEDIUM_LIST)
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
