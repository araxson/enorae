import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { Salon, SalonSearchParams } from './types'
import { createCachedQuery } from '@/lib/cache'

async function createPublicClient() {
  return createClient()
}

async function fetchPublicSalons(params?: SalonSearchParams): Promise<Salon[]> {
  const supabase = await createPublicClient()

  // If we have search params, use the search_salons function
  if (params?.searchTerm || params?.city || params?.state) {
    let filteredQuery = supabase
      .from('salons')
      .select('*')
      .eq('is_active', true)

    if (params.searchTerm) {
      const term = `%${params.searchTerm}%`
      filteredQuery = filteredQuery.or(
        `name.ilike.${term},short_description.ilike.${term},full_description.ilike.${term}`
      )
    }

    if (params.city) {
      filteredQuery = filteredQuery.ilike('city', params.city)
    }

    if (params.state) {
      filteredQuery = filteredQuery.ilike('state_province', params.state)
    }

    if (typeof params.isVerified === 'boolean') {
      filteredQuery = filteredQuery.eq('is_verified', params.isVerified)
    }

    if (typeof params.limit === 'number') {
      filteredQuery = filteredQuery.limit(params.limit)
    }

    const { data, error } = await filteredQuery
      .order('rating_average', { ascending: false, nullsFirst: false })
      .returns<Salon[]>()

    if (error) throw error
    return data ?? []
  }

  // Default: get all active salons
  let query = supabase
    .from('salons')
    .select('*')
    .eq('is_active', true)
    .order('rating_average', { ascending: false, nullsFirst: false })

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  const { data, error } = await query.returns<Salon[]>()

  if (error) throw error
  return data ?? []
}

/**
 * Get all active public salons with optional filters
 * Public endpoint - no auth required
 */
export const getPublicSalons = createCachedQuery(fetchPublicSalons, {
  keyPrefix: 'marketing-public-salons',
  revalidate: 3600,
})

/**
 * Get salon by slug for public profile page
 * Public endpoint - no auth required
 */
export async function getPublicSalonBySlug(slug: string): Promise<Salon | null> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle<Salon>()

  if (error) throw error
  return data
}

/**
 * Get salons by city for location pages
 * Public endpoint - no auth required
 */
export async function getPublicSalonsByCity(city: string, state?: string): Promise<Salon[]> {
  const supabase = await createPublicClient()

  let query = supabase
    .from('salons')
    .select('*')
    .eq('is_active', true)
    .ilike('city', city)

  if (state) {
    query = query.ilike('state_province', state)
  }

  query = query.order('rating_average', { ascending: false, nullsFirst: false })

  const { data, error } = await query.returns<Salon[]>()

  if (error) throw error
  return data ?? []
}
