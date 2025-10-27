import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import {
  chainIdentifierSchema,
  chainLocationSchema,
} from '@/features/customer/chains/schema'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
type SalonOverview = Database['public']['Views']['admin_salons_overview_view']['Row']
type SalonDetail = Database['public']['Views']['salons_view']['Row']

export type ChainSalonLocation = {
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

export type SalonChainWithLocations = SalonChain & {
  locations?: ChainSalonLocation[]
}

async function fetchChainLocations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  chainId: string
) {
  const { data: overviewData, error: overviewError } = await supabase
    .from('admin_salons_overview_view')
    .select('id, name, slug, rating_average, rating_count, chain_id')
    .eq('chain_id', chainId)
    .order('name', { ascending: true })

  if (overviewError) throw overviewError

  const sanitizedOverview = (overviewData || []).filter(
    (row): row is SalonOverview & { id: string } => typeof row['id'] === 'string' && row['id'] !== null
  )

  if (sanitizedOverview.length === 0) {
    return []
  }

  const salonIds = sanitizedOverview.map((row) => row.id)
  const { data: detailData, error: detailError } = await supabase
    .from('salons_view')
    .select('id, name, formatted_address, city, state_province, is_verified')
    .in('id', salonIds)

  if (detailError) throw detailError

  const detailMap = new Map(
    (detailData || [])
      .filter((detail) => typeof detail['id'] === 'string' && detail['id'] !== null)
      .map((detail) => [detail['id']!, detail])
  )

  return sanitizedOverview.map<ChainSalonLocation>((row) => {
    const detail = detailMap.get(row.id)

    return {
      id: row.id,
      name: row['name'] ?? detail?.['name'] ?? null,
      slug: row['slug'] ?? null,
      formatted_address: detail?.['formatted_address'] ?? null,
      city: detail?.['city'] ?? null,
      state_province: detail?.['state_province'] ?? null,
      rating_average: row['rating_average'] ?? null,
      rating_count: row['rating_count'] ?? null,
      is_verified: detail?.['is_verified'] ?? null,
    }
  })
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

  const { idOrSlug: identifier } = chainIdentifierSchema.parse({ idOrSlug })

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

  const { data: chain, error: chainError } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq(isUuid ? 'id' : 'slug', identifier)
    .eq('is_active', true)
    .maybeSingle<{ id: string; [key: string]: unknown }>()

  if (chainError) {
    if (chainError.code === 'PGRST116') return null
    throw chainError
  }

  if (!chain || typeof chain.id !== 'string') return null

  const locations = await fetchChainLocations(supabase, chain.id)

  return {
    ...(chain as SalonChain),
    locations,
  } as SalonChainWithLocations
}

/**
 * Get salons belonging to a specific chain
 */
export async function getChainLocations(chainId: string): Promise<ChainSalonLocation[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { chainId: validatedChainId } = chainLocationSchema.parse({ chainId })
  return fetchChainLocations(supabase, validatedChainId)
}
