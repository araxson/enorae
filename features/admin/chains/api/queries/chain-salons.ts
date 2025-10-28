import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type {
  AdminSalonOverviewRow,
  ChainSalon,
  LocationAddressRow,
  SalonLocationRow,
} from './types'

export async function getChainSalons(chainId: string): Promise<ChainSalon[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: salonSummaries, error } = await supabase
    .from('admin_salons_overview_view')
    .select('id, name, chain_id, rating_average, rating_count, is_accepting_bookings, created_at')
    .eq('chain_id', chainId)
    .order('created_at', { ascending: false })
    .returns<AdminSalonOverviewRow[]>()

  if (error) throw error

  const salons = salonSummaries ?? []
  const salonIds = salons.map((salon) => salon['id']).filter((id): id is string => Boolean(id))

  if (salonIds.length === 0) {
    return []
  }

  const { data: locations, error: locationsError } = await supabase
    .from('salon_locations_view')
    .select('id, salon_id, is_primary')
    .in('salon_id', salonIds)
    .eq('is_primary', true)
    .returns<SalonLocationRow[]>()

  if (locationsError) throw locationsError

  const locationIds = (locations ?? [])
    .map((location) => location['id'])
    .filter((id): id is string => Boolean(id))

  let addressMap = new Map<string, { city: string | null; state: string | null }>()

  if (locationIds.length > 0) {
    const { data: addresses, error: addressesError } = await supabase
      .from('location_addresses_view')
      .select('location_id, city, state_province')
      .in('location_id', locationIds)
      .returns<LocationAddressRow[]>()

    if (addressesError) throw addressesError

    addressMap = new Map(
      (addresses ?? [])
        .filter(
          (address): address is LocationAddressRow & { location_id: string } =>
            Boolean(address['location_id']),
        )
        .map((address) => [
          address['location_id'],
          { city: address['city'] ?? null, state: address['state_province'] ?? null },
        ]),
    )
  }

  const locationBySalonId = new Map<string, { city: string | null; state: string | null }>()
  for (const location of locations ?? []) {
    if (!location['salon_id'] || !location['id']) continue
    const address = addressMap.get(location['id']) ?? { city: null, state: null }
    locationBySalonId.set(location['salon_id'], address)
  }

  return salons
    .filter((salon): salon is AdminSalonOverviewRow & { id: string } => Boolean(salon['id']))
    .map((salon) => {
      const location = locationBySalonId.get(salon['id'])
      return {
        id: salon['id'],
        name: salon['name'] ?? 'Unknown',
        city: location?.['city'] ?? null,
        state: location?.state ?? null,
        isAcceptingBookings: Boolean(salon['is_accepting_bookings']),
        ratingAverage: typeof salon['rating_average'] === 'number' ? salon['rating_average'] : null,
        ratingCount: Number(salon['rating_count']) || 0,
        createdAt: salon['created_at'] ?? null,
      }
    })
}
