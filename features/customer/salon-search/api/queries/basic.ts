import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { SalonSearchResult, SearchFilters } from '../../types'
import { createOperationLogger } from '@/lib/observability'

export async function searchSalons(filters: SearchFilters): Promise<SalonSearchResult[]> {
  const logger = createOperationLogger('searchSalons', {})
  logger.start()

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

  const isSalonRow = (item: unknown): item is SalonRow => {
    return item !== null && typeof item === 'object' && 'id' in item
  }

  const data = (salons || []).filter(isSalonRow).map((salon) => ({
    id: salon.id || '',
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

  type SalonRow = {
    id: string
    name: string | null
    slug: string | null
    address: { street?: string; city?: string; state?: string; zip_code?: string } | null
    rating_average: number | null
    is_verified: boolean | null
    is_featured: boolean | null
  }

  const isSalonRow = (item: unknown): item is SalonRow => {
    return item !== null && typeof item === 'object' && 'id' in item
  }

  return (data || []).filter(isSalonRow).map((salon): SalonSearchResult => ({
    id: salon.id || '',
    name: salon.name || '',
    slug: salon.slug || '',
    address: salon.address || null,
    rating_average: salon.rating_average || 0,
    is_verified: salon.is_verified || false,
    is_featured: salon.is_featured || false,
  }))
}
