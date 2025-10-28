import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type {
  AdminSalonOverviewRow,
  ChainCompliance,
  SalonChainRow,
} from './types'

export async function getChainCompliance(): Promise<ChainCompliance[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: chains, error: chainsError } = await supabase
    .from('salon_chains_view')
    .select('id, name, is_verified, is_active')
    .is('deleted_at', null)
    .returns<SalonChainRow[]>()

  if (chainsError) throw chainsError

  const results: ChainCompliance[] = []

  for (const chain of chains ?? []) {
    if (!chain['id']) continue

    const { data: salonSummaries, error: salonsError } = await supabase
      .from('admin_salons_overview_view')
      .select('id, chain_id, is_accepting_bookings')
      .eq('chain_id', chain['id'])
      .returns<AdminSalonOverviewRow[]>()

    if (salonsError) throw salonsError

    const totalSalons = salonSummaries?.length ?? 0
    const activeSalons =
      salonSummaries?.filter((salon) => Boolean(salon['is_accepting_bookings'])).length ?? 0
    const inactiveSalons = Math.max(totalSalons - activeSalons, 0)
    const complianceRate = totalSalons > 0 ? (activeSalons / totalSalons) * 100 : 0

    const issues: string[] = []
    if (!chain['is_verified']) issues.push('Chain not verified')
    if (chain['is_active'] === false) issues.push('Chain inactive')
    if (inactiveSalons > 0) issues.push(`${inactiveSalons} paused salons`)
    if (complianceRate < 80 && totalSalons > 0) issues.push('Compliance below 80%')

    results.push({
      chainId: chain['id'],
      chainName: chain['name'] ?? 'Unknown',
      totalSalons,
      verifiedSalons: activeSalons,
      unverifiedSalons: inactiveSalons,
      complianceRate,
      issues,
    })
  }

  return results.sort((a, b) => a.complianceRate - b.complianceRate)
}
