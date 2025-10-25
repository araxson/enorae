import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type {
  AdminRevenueOverviewRow,
  AdminSalonOverviewRow,
  SalonChainRow,
} from './types'

interface HealthScoreInput {
  isVerified: boolean
  isActive: boolean
  avgRating: number
  activeSalonsRatio: number
}

export async function getChainHealthMetrics(chainId: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: chain, error: chainError } = await supabase
    .from('salon_chains_view')
    .select('id, name, is_verified, is_active, subscription_tier')
    .eq('id', chainId)
    .single<SalonChainRow>()

  if (chainError) throw chainError
  if (!chain?.['id']) {
    throw new Error('Chain not found')
  }

  const { data: salonSummaries, error: salonsError } = await supabase
    .from('admin_salons_overview')
    .select(
      'id, chain_id, rating_average, rating_count, is_accepting_bookings, total_revenue, total_bookings',
    )
    .eq('chain_id', chain['id'])
    .returns<AdminSalonOverviewRow[]>()

  if (salonsError) throw salonsError

  const salons = salonSummaries ?? []
  const salonIds = salons.map((salon) => salon['id']).filter((id): id is string => Boolean(id))

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDateIso = thirtyDaysAgo.toISOString().split('T')[0]

  let monthlyRevenue = 0
  let monthlyAppointments = 0

  if (salonIds.length > 0) {
    const { data: revenueRows, error: revenueError } = await supabase
      .from('admin_revenue_overview')
      .select('salon_id, total_revenue, total_appointments, date')
      .in('salon_id', salonIds)
      .gte('date', startDateIso)
      .returns<AdminRevenueOverviewRow[]>()

    if (revenueError) throw revenueError

    monthlyRevenue = (revenueRows ?? []).reduce(
      (sum, row) => sum + (Number(row['total_revenue']) || 0),
      0,
    )
    monthlyAppointments = (revenueRows ?? []).reduce(
      (sum, row) => sum + (Number(row['total_appointments']) || 0),
      0,
    )
  }

  const totalSalons = salons.length
  const activeSalons = salons.filter((salon) => Boolean(salon['is_accepting_bookings'])).length

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
    chainName: chain['name'],
    isVerified: chain['is_verified'],
    isActive: chain['is_active'],
    totalSalons,
    activeSalons,
    avgRating,
    monthlyRevenue,
    monthlyAppointments,
    subscriptionTier: chain['subscription_tier'],
    healthScore: calculateHealthScore({
      isVerified: chain['is_verified'] ?? false,
      isActive: chain['is_active'] ?? false,
      avgRating,
      activeSalonsRatio: totalSalons > 0 ? activeSalons / totalSalons : 0,
    }),
  }
}

function calculateHealthScore(metrics: HealthScoreInput): number {
  let score = 0

  if (metrics.isVerified) score += 25
  if (metrics['isActive']) score += 25
  score += (metrics.avgRating / 5) * 25
  score += metrics.activeSalonsRatio * 25

  return Math.round(score)
}
