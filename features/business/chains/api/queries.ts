import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// FIXED: Use salon_chains_view instead of table
type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
export type SalonChainWithCounts = SalonChain

/**
 * Get all chains accessible to the user
 * Uses salon_chains_view for pre-computed salon_count and total_staff_count
 */
export async function getSalonChains(): Promise<SalonChain[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Query the view instead of table - view includes salon_count and total_staff_count
  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('owner_id', session.user.id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []) as SalonChain[]
}

/**
 * Get single salon chain by ID
 * Uses salon_chains_view for enriched data
 */
export async function getSalonChainById(
  id: string
): Promise<SalonChain | null> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('id', id)
    .eq('owner_id', session.user.id)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as SalonChain
}
