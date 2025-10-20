import 'server-only'
import { requireAuth } from '@/lib/auth'
import type { SalonSearchResult, SearchFilters } from './types'

export async function searchSalons(filters: SearchFilters): Promise<SalonSearchResult[]> {
  await requireAuth()
  console.warn('[CustomerSearch] searchSalons is currently disabled until search backend is provisioned.')
  return []
}

export async function searchSalonsWithFuzzyMatch(
  searchTerm: string,
  limit = 10
): Promise<SalonSearchResult[]> {
  await requireAuth()
  console.warn('[CustomerSearch] searchSalonsWithFuzzyMatch is currently disabled until search backend is provisioned.')
  return []
}

export async function getSalonSearchSuggestions(
  searchTerm: string,
  limit = 5
): Promise<{ name: string; slug: string }[]> {
  await requireAuth()

  console.warn('[CustomerSearch] getSalonSearchSuggestions is currently disabled until search backend is provisioned.')
  return []
}
