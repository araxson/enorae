import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']

export interface SalonFilters {
  chain_id?: string
  subscription_tier?: string
  search?: string
  is_deleted?: boolean
}

/**
 * Get all salons with aggregated data
 * SECURITY: Platform admin only
 */
export async function getAllSalons(filters?: SalonFilters): Promise<AdminSalon[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  let query = supabase
    .from('admin_salons_overview')
    .select('*')
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters?.chain_id) {
    query = query.eq('chain_id', filters.chain_id)
  }

  if (filters?.subscription_tier) {
    query = query.eq('subscription_tier', filters.subscription_tier)
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`
    )
  }

  if (filters?.is_deleted !== undefined) {
    if (filters.is_deleted) {
      query = query.not('deleted_at', 'is', null)
    } else {
      query = query.is('deleted_at', null)
    }
  } else {
    // Default: exclude deleted salons
    query = query.is('deleted_at', null)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

/**
 * Get single salon by ID with full details
 * SECURITY: Platform admin only
 */
export async function getSalonById(salonId: string): Promise<AdminSalon | null> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .eq('id', salonId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get salon statistics
 * SECURITY: Platform admin only
 */
export async function getSalonStats() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  // Total salons
  const { count: totalSalons } = await supabase
    .from('salons')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  // Active salons (accepting bookings)
  const { count: activeSalons } = await supabase
    .from('salon_settings')
    .select('*', { count: 'exact', head: true })
    .eq('is_accepting_bookings', true)

  // Salons by subscription tier
  const { data: tierDistribution } = await supabase
    .from('salon_settings')
    .select('subscription_tier')

  const tierCounts = (tierDistribution || []).reduce(
    (acc, { subscription_tier }) => {
      acc[subscription_tier || 'free'] = (acc[subscription_tier || 'free'] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Salons by business type
  const { data: typeDistribution } = await supabase
    .from('salons')
    .select('business_type')
    .is('deleted_at', null)

  const typeCounts = (typeDistribution || []).reduce(
    (acc, { business_type }) => {
      const type = (business_type || 'salon') as string
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    total: totalSalons || 0,
    active: activeSalons || 0,
    byTier: tierCounts,
    byType: typeCounts,
  }
}

/**
 * Search salons
 * SECURITY: Platform admin only
 */
export async function searchSalons(searchTerm: string): Promise<AdminSalon[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .or(
      `name.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}
