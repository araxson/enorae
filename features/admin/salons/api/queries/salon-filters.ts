import 'server-only'

import { getAllSalons, type AdminSalon } from './salon-list'
import { createOperationLogger } from '@/lib/observability'

export interface SalonFilters {
  chain_id?: string
  subscription_tier?: string
  search?: string
  is_deleted?: boolean
}

// Compatibility export for existing call sites
export async function getAllSalonsLegacy(filters?: SalonFilters): Promise<{
  salons: AdminSalon[]
  stats: {
    total: number
    active: number
    pending: number
    suspended: number
    verified: number
    expiringLicenses: number
    highRisk: number
    averageCompliance: number
    byTier: Record<string, number>
    byType: Record<string, number>
  }
}> {
  const logger = createOperationLogger('getAllSalonsLegacy', {})
  logger.start()

  const { salons, stats } = await getAllSalons()

  const filtered = (filters ? applySalonFilters(salons, filters) : salons)
  // Map stats to include pending and suspended for legacy compatibility
  const legacyStats = {
    ...stats,
    pending: 0, // Not tracked in current implementation
    suspended: salons.filter((s) => s['deleted_at'] !== null).length,
  }
  return { salons: filtered, stats: legacyStats }
}

function applySalonFilters(salons: AdminSalon[], filters: SalonFilters) {
  return salons.filter((salon) => {
    const matchesChain = !filters['chain_id'] || salon['chain_id'] === filters['chain_id']
    const matchesTier = !filters['subscription_tier'] || salon.subscriptionTier === filters['subscription_tier']
    const matchesSearch = !filters.search
      ? true
      : [salon['name'], salon['business_name'], salon['slug']]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(filters.search?.toLowerCase() ?? ''))

    return matchesChain && matchesTier && matchesSearch
  })
}
