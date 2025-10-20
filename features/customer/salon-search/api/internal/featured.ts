import 'server-only'
import { requireAuth } from '@/lib/auth'
import type { SalonSearchResult } from './types'

export async function getFeaturedSalons(limit = 6): Promise<SalonSearchResult[]> {
  await requireAuth()
  console.warn('[CustomerSearch] getFeaturedSalons is currently disabled until curated data is available.')
  return []
}

export async function getNearbyServices(
  salonId: string,
  limit = 5
): Promise<{ id: string; name: string; salon_name: string; salon_slug: string }[]> {
  await requireAuth()
  console.warn('[CustomerSearch] getNearbyServices is currently disabled until curated data is available.')
  return []
}
