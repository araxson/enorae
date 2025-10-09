import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export interface ChainAnalytics {
  chainId: string
  chainName: string
  totalSalons: number
  totalStaff: number
  totalRevenue: number
  totalAppointments: number
  avgRating: number
  verificationStatus: boolean
  subscriptionTier: string | null
}

export interface ChainSalon {
  id: string
  name: string
  city: string | null
  state: string | null
  is_verified: boolean
  rating: number | null
  total_reviews: number
  created_at: string
}

export interface ChainCompliance {
  chainId: string
  chainName: string
  totalSalons: number
  verifiedSalons: number
  unverifiedSalons: number
  complianceRate: number
  issues: string[]
}

/**
 * Get all chains across the platform (admin view)
 * SECURITY: Platform admin only
 */
export async function getAllSalonChains(): Promise<SalonChain[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []) as SalonChain[]
}

/**
 * Get chain by ID (admin view)
 * SECURITY: Platform admin only
 */
export async function getChainById(chainId: string): Promise<SalonChain | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('id', chainId)
    .single()

  if (error) throw error
  return data as SalonChain
}

/**
 * Get chain analytics with aggregated metrics
 */
export async function getChainAnalytics(chainId?: string): Promise<ChainAnalytics[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  // Get all chains or specific chain
  let chainsQuery = supabase
    .from('salon_chains_view')
    .select('*')
    .is('deleted_at', null)

  if (chainId) {
    chainsQuery = chainsQuery.eq('id', chainId)
  }

  const { data: chains, error: chainsError } = await chainsQuery

  if (chainsError) throw chainsError

  // Get salons for each chain
  const analytics: ChainAnalytics[] = await Promise.all(
    (chains || []).map(async (chain) => {
      const { data: salons } = await supabase
        .from('salons')
        .select('id, rating, total_reviews')
        .eq('chain_id', chain.id)
        .is('deleted_at', null)

      const { data: revenue } = await supabase
        .from('admin_revenue_overview')
        .select('total_revenue, total_appointments')
        .in('salon_id', (salons || []).map(s => s.id))

      const totalRevenue = (revenue || []).reduce((sum, r) => sum + (Number(r.total_revenue) || 0), 0)
      const totalAppointments = (revenue || []).reduce((sum, r) => sum + (r.total_appointments || 0), 0)

      const ratings = (salons || []).filter(s => s.rating).map(s => Number(s.rating))
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

      return {
        chainId: chain.id!,
        chainName: chain.name || 'Unknown',
        totalSalons: chain.salon_count || 0,
        totalStaff: chain.total_staff_count || 0,
        totalRevenue,
        totalAppointments,
        avgRating,
        verificationStatus: chain.is_verified || false,
        subscriptionTier: chain.subscription_tier
      }
    })
  )

  return analytics
}

/**
 * Get salons belonging to a chain
 */
export async function getChainSalons(chainId: string): Promise<ChainSalon[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salons')
    .select('id, name, city, state, is_verified, rating, total_reviews, created_at')
    .eq('chain_id', chainId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map(salon => ({
    id: salon.id,
    name: salon.name || 'Unknown',
    city: salon.city,
    state: salon.state,
    is_verified: salon.is_verified || false,
    rating: salon.rating,
    total_reviews: salon.total_reviews || 0,
    created_at: salon.created_at || ''
  }))
}

/**
 * Get chain compliance status
 */
export async function getChainCompliance(): Promise<ChainCompliance[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: chains, error: chainsError } = await supabase
    .from('salon_chains_view')
    .select('*')
    .is('deleted_at', null)

  if (chainsError) throw chainsError

  const compliance: ChainCompliance[] = await Promise.all(
    (chains || []).map(async (chain) => {
      const { data: salons } = await supabase
        .from('salons')
        .select('id, is_verified')
        .eq('chain_id', chain.id)
        .is('deleted_at', null)

      const totalSalons = salons?.length || 0
      const verifiedSalons = salons?.filter(s => s.is_verified).length || 0
      const unverifiedSalons = totalSalons - verifiedSalons
      const complianceRate = totalSalons > 0 ? (verifiedSalons / totalSalons) * 100 : 0

      const issues: string[] = []
      if (!chain.is_verified) issues.push('Chain not verified')
      if (!chain.is_active) issues.push('Chain inactive')
      if (unverifiedSalons > 0) issues.push(`${unverifiedSalons} unverified salons`)
      if (complianceRate < 80) issues.push('Low verification rate')

      return {
        chainId: chain.id!,
        chainName: chain.name || 'Unknown',
        totalSalons,
        verifiedSalons,
        unverifiedSalons,
        complianceRate,
        issues
      }
    })
  )

  return compliance.sort((a, b) => a.complianceRate - b.complianceRate)
}

/**
 * Get chain health metrics
 */
export async function getChainHealthMetrics(chainId: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const [chain, salons, revenue] = await Promise.all([
    supabase.from('salon_chains_view').select('*').eq('id', chainId).single(),
    supabase.from('salons').select('*').eq('chain_id', chainId).is('deleted_at', null),
    supabase.from('admin_revenue_overview').select('*').limit(30)
  ])

  if (chain.error) throw chain.error

  const salonIds = (salons.data || []).map(s => s.id)
  const chainRevenue = (revenue.data || []).filter(r => salonIds.includes(r.salon_id || ''))

  const activeServices = (salons.data || []).filter(s => s.is_active).length
  const avgRating = salons.data?.length
    ? salons.data.reduce((sum, s) => sum + (Number(s.rating) || 0), 0) / salons.data.length
    : 0

  const monthlyRevenue = chainRevenue.reduce((sum, r) => sum + (Number(r.total_revenue) || 0), 0)
  const monthlyAppointments = chainRevenue.reduce((sum, r) => sum + (r.total_appointments || 0), 0)

  return {
    chainName: chain.data?.name,
    isVerified: chain.data?.is_verified,
    isActive: chain.data?.is_active,
    totalSalons: salons.data?.length || 0,
    activeSalons: activeServices,
    avgRating,
    monthlyRevenue,
    monthlyAppointments,
    subscriptionTier: chain.data?.subscription_tier,
    healthScore: calculateHealthScore({
      isVerified: chain.data?.is_verified || false,
      isActive: chain.data?.is_active || false,
      avgRating,
      activeSalonsRatio: activeServices / (salons.data?.length || 1)
    })
  }
}

function calculateHealthScore(metrics: {
  isVerified: boolean
  isActive: boolean
  avgRating: number
  activeSalonsRatio: number
}): number {
  let score = 0

  if (metrics.isVerified) score += 25
  if (metrics.isActive) score += 25
  score += (metrics.avgRating / 5) * 25
  score += metrics.activeSalonsRatio * 25

  return Math.round(score)
}
