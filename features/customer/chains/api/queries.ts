import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains']['Row']
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
    .from('salon_chains')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
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
    .from('salon_chains')
    .select('*')
    .eq(isUuid ? 'id' : 'slug', idOrSlug)
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (chainError) {
    if (chainError.code === 'PGRST116') return null
    throw chainError
  }

  if (!chain) return null

  // Get all salons in this chain
  const { data: locations, error: locationsError } = await supabase
    .from('salons')
    .select('*')
    .eq('chain_id', chain.id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (locationsError) throw locationsError

  return {
    ...(chain as SalonChain),
    locations: (locations as ChainSalonLocation[]) || [],
  } as SalonChainWithLocations
}

/**
 * Get salons belonging to a specific chain
 */
export async function getChainLocations(chainId: string): Promise<Salon[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('chain_id', chainId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}