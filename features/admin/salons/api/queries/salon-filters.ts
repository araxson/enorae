import 'server-only'

import { getAllSalons, type AdminSalon } from './salon-list'

export interface SalonFilters {
  chain_id?: string
  subscription_tier?: string
  search?: string
  is_deleted?: boolean
}

// Compatibility export for existing call sites
export async function getAllSalonsLegacy(filters?: SalonFilters) {
  const { salons, stats } = await getAllSalons()

  const filtered = (filters ? applySalonFilters(salons, filters) : salons)
  return { salons: filtered, stats }
}

function applySalonFilters(salons: AdminSalon[], filters: SalonFilters) {
  return salons.filter((salon) => {
    const matchesChain = !filters['chain_id'] || salon['chain_id'] === filters['chain_id']
    const matchesTier = !filters['subscription_tier'] || salon.subscriptionTier === filters['subscription_tier']
    const matchesSearch = !filters.search
      ? true
      : [salon['name'], salon['business_name'], salon['slug']]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(filters.search!.toLowerCase()))

    return matchesChain && matchesTier && matchesSearch
  })
}
