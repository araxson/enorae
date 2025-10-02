import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: salon_chains doesn't have public view yet

type SalonChain = Database['public']['Views']['salon_chains']['Row']

export type SalonChainWithCounts = SalonChain & {
  salon_count?: number
}

/**
 * Get all chains accessible to the user
 */
export async function getSalonChains(): Promise<SalonChainWithCounts[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get all chains where user is an owner
  const { data, error } = await supabase
    .from('salon_chains')
    .select('*')
    .eq('owner_id', user.id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error

  // Get salon counts for each chain
  const chainsWithCounts = await Promise.all(
    (data || []).map(async (chain) => {
      const { count } = await supabase
        .from('salons')
        .select('*', { count: 'exact', head: true })
        .eq('chain_id', chain.id)
        .is('deleted_at', null)

      return {
        ...chain,
        salon_count: count || 0,
      }
    })
  )

  return chainsWithCounts
}

/**
 * Get single salon chain by ID
 */
export async function getSalonChainById(
  id: string
): Promise<SalonChain | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salon_chains')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}
