import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export type ChainSalonLocation = Salon & {
  address?: string | null
  average_rating?: number | null
  is_verified?: boolean | null
  review_count?: number | null
}

export type SalonChainWithLocations = SalonChain & {
  locations?: ChainSalonLocation[]
}

/**
 * Get all active salon chains
 */
export async function getSalonChains(): Promise<SalonChain[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get a specific salon chain by ID or slug with its locations
 */
export async function getSalonChainById(
  idOrSlug: string
): Promise<SalonChainWithLocations | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Check if it's a UUID or slug
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)

  const { data: chain, error: chainError } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq(isUuid ? 'id' : 'slug', idOrSlug)
    .eq('is_active', true)
    .maybeSingle() as { data: SalonChain | null; error: PostgrestError | null }

  if (chainError) {
    if (chainError.code === 'PGRST116') return null
    throw chainError
  }

  if (!chain) return null

  // Get all salons in this chain
  type SalonRow = {
    id: string
    name: string | null
    slug: string | null
    formatted_address: string | null
    city: string | null
    state_province: string | null
    rating_average: number | null
    rating_count: number | null
    is_verified: boolean | null
  }

  const { data: locations, error: locationsError } = await supabase
    .schema('organization')
    .from('salons')
    .select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_verified')
    .eq('chain_id', chain['id']!)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true }) as { data: SalonRow[] | null; error: PostgrestError | null }

  if (locationsError) throw locationsError

  return {
    ...chain,
    locations: (locations || []).map((loc: SalonRow) => ({
      ...loc,
      address: loc.formatted_address,
      average_rating: loc['rating_average'],
      review_count: loc['rating_count'],
    })) as ChainSalonLocation[],
  } as SalonChainWithLocations
}

/**
 * Get salons belonging to a specific chain
 */
export async function getChainLocations(chainId: string): Promise<Salon[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Query from schema table since chain_id is not in public view
  type SalonRow = {
    id: string
    name: string | null
    slug: string | null
    formatted_address: string | null
    city: string | null
    state_province: string | null
    rating_average: number | null
    rating_count: number | null
    is_verified: boolean | null
  }
  const { data, error } = await supabase
    .schema('organization')
    .from('salons')
    .select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_verified')
    .eq('chain_id', chainId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true }) as { data: SalonRow[] | null; error: PostgrestError | null }

  if (error) throw error
  return (data || []) as Salon[]
}