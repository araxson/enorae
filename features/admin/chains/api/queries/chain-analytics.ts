import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

import type {
  AdminSalonOverviewRow,
  ChainAnalytics,
  SalonChainRow,
} from '../../api/types'

export async function getChainAnalytics(chainId?: string): Promise<ChainAnalytics[]> {
  const logger = createOperationLogger('getChainAnalytics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  let chainsQuery = supabase
    .from('salon_chains_view')
    .select('id, name, salon_count, staff_count, is_verified, subscription_tier')
    .is('deleted_at', null)

  if (chainId) {
    chainsQuery = chainsQuery.eq('id', chainId)
  }

  const { data: rawChains, error: chainsError } = await chainsQuery
  if (chainsError) throw chainsError

  const chains = (rawChains ?? []) as SalonChainRow[]
  const validChains = chains.filter(
    (chain): chain is SalonChainRow & { id: string } => Boolean(chain['id']),
  )

  // PERFORMANCE FIX: Batch fetch all salons for all chains in one query (prevents N+1)
  const chainIds = validChains.map(chain => chain['id'])
  const { data: allSalons, error: salonsError } = await supabase
    .from('admin_salons_overview_view')
    .select('id, chain_id, name, rating_average, rating_count, total_revenue, total_bookings')
    .in('chain_id', chainIds)
    .returns<AdminSalonOverviewRow[]>()

  if (salonsError) throw salonsError

  // Group salons by chain_id for efficient lookup
  const salonsByChain = new Map<string, AdminSalonOverviewRow[]>()
  for (const salon of allSalons ?? []) {
    if (!salon['chain_id']) continue
    if (!salonsByChain.has(salon['chain_id'])) {
      salonsByChain.set(salon['chain_id'], [])
    }
    salonsByChain.get(salon['chain_id'])!.push(salon)
  }

  const analytics: ChainAnalytics[] = validChains.map(chain => {
    const salons = salonsByChain.get(chain['id']) ?? []

    const totalRevenue = salons.reduce(
      (sum, salon) => sum + (Number(salon['total_revenue']) || 0),
      0,
    )
    const totalAppointments = salons.reduce(
      (sum, salon) => sum + (Number(salon['total_bookings']) || 0),
      0,
    )

    const ratingTotals = salons.reduce(
      (acc, salon) => {
        const rating = Number(salon['rating_average']) || 0
        const count = Number(salon['rating_count']) || 0
        acc['weightedSum'] += rating * count
        acc['totalCount'] += count
        return acc
      },
      { weightedSum: 0, totalCount: 0 },
    )

    const avgRating =
      ratingTotals['totalCount'] > 0 ? ratingTotals['weightedSum'] / ratingTotals['totalCount'] : 0

    return {
      chainId: chain['id'],
      chainName: chain['name'] ?? 'Unknown',
      totalSalons: chain['salon_count'] ?? salons.length ?? 0,
      totalStaff: chain['staff_count'] ?? 0,
      totalRevenue,
      totalAppointments,
      avgRating,
      verificationStatus: Boolean(chain['is_verified']),
      subscriptionTier: chain['subscription_tier'] ?? null,
    }
  })

  return analytics
}
