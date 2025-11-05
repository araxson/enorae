import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

import type {
  AdminSalonOverviewRow,
  ChainCompliance,
  SalonChainRow,
} from '../../api/types'

export async function getChainCompliance(): Promise<ChainCompliance[]> {
  const logger = createOperationLogger('getChainCompliance', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: chains, error: chainsError } = await supabase
    .from('salon_chains_view')
    .select('id, name, is_verified, is_active')
    .is('deleted_at', null)
    .returns<SalonChainRow[]>()

  if (chainsError) throw chainsError

  // PERFORMANCE FIX: Batch fetch all salons in one query instead of N+1
  const chainIds = (chains ?? []).map((c) => c['id']).filter(Boolean) as string[]

  if (chainIds.length === 0) return []

  const { data: allSalonSummaries, error: salonsError } = await supabase
    .from('admin_salons_overview_view')
    .select('id, chain_id, is_accepting_bookings')
    .in('chain_id', chainIds)
    .returns<AdminSalonOverviewRow[]>()

  if (salonsError) throw salonsError

  // Group salons by chain_id
  const salonsByChain = new Map<string, AdminSalonOverviewRow[]>()
  for (const salon of allSalonSummaries ?? []) {
    const chainId = salon['chain_id']
    if (!chainId) continue
    if (!salonsByChain.has(chainId)) {
      salonsByChain.set(chainId, [])
    }
    const chainSalons = salonsByChain.get(chainId)
    if (chainSalons) {
      chainSalons.push(salon)
    }
  }

  const results: ChainCompliance[] = []

  for (const chain of chains ?? []) {
    if (!chain['id']) continue

    const salonSummaries = salonsByChain.get(chain['id']) ?? []
    const totalSalons = salonSummaries.length
    const activeSalons = salonSummaries.filter((salon) => Boolean(salon['is_accepting_bookings'])).length
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
