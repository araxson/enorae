import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type LocationAddress = Database['public']['Views']['location_addresses']['Row']

export async function getLocationAddress(locationId: string): Promise<LocationAddress | null> {
  // SECURITY: Require business user role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify location ownership through salon
  const { data: location } = await supabase
    .from('salon_locations')
    .select('salon_id')
    .eq('id', locationId)
    .single<{ salon_id: string | null }>()

  if (!location || !location.salon_id) {
    throw new Error('Location not found')
  }

  const { data: salon } = await supabase
    .from('salons')
    .select('owner_id')
    .eq('id', location.salon_id)
    .single<{ owner_id: string | null }>()

  if (!salon || salon.owner_id !== session.user.id) {
    throw new Error('Unauthorized: Not your location')
  }

  const { data, error } = await supabase
    .from('location_addresses')
    .select('*')
    .eq('location_id', locationId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data
}

export async function getAllLocationAddresses(): Promise<LocationAddress[]> {
  // SECURITY: Require business user role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get user's salons
  const { data: salons } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .returns<{ id: string }[]>()

  if (!salons || salons.length === 0) {
    return []
  }

  const salonIds = salons.map(s => s.id)

  // Get all locations for user's salons
  const { data: locations } = await supabase
    .from('salon_locations')
    .select('id')
    .in('salon_id', salonIds)
    .returns<{ id: string }[]>()

  if (!locations || locations.length === 0) {
    return []
  }

  const locationIds = locations.map(l => l.id)

  // Get all addresses for these locations
  const { data, error } = await supabase
    .from('location_addresses')
    .select('*')
    .in('location_id', locationIds)

  if (error) throw error
  return data || []
}
