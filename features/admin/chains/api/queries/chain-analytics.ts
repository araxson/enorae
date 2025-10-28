import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type {
  AdminSalonOverviewRow,
  ChainAnalytics,
  SalonChainRow,
} from './types'

export async function getChainAnalytics(chainId?: string): Promise<ChainAnalytics[]> {
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

  const analytics: ChainAnalytics[] = []

  for (const chain of validChains) {
    const { data: salons, error: salonsError } = await supabase
      .from('admin_salons_overview_view')
      .select('id, chain_id, name, rating_average, rating_count, total_revenue, total_bookings')
      .eq('chain_id', chain['id'])
      .returns<AdminSalonOverviewRow[]>()

    if (salonsError) throw salonsError

    const totalRevenue = (salons ?? []).reduce(
      (sum, salon) => sum + (Number(salon['total_revenue']) || 0),
      0,
    )
    const totalAppointments = (salons ?? []).reduce(
      (sum, salon) => sum + (Number(salon['total_bookings']) || 0),
      0,
    )

    const ratingTotals = (salons ?? []).reduce(
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

    analytics.push({
      chainId: chain['id'],
      chainName: chain['name'] ?? 'Unknown',
      totalSalons: chain['salon_count'] ?? salons?.length ?? 0,
      totalStaff: chain['staff_count'] ?? 0,
      totalRevenue,
      totalAppointments,
      avgRating,
      verificationStatus: Boolean(chain['is_verified']),
      subscriptionTier: chain['subscription_tier'] ?? null,
    })
  }

  return analytics
}
