'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function bulkUpdateAddresses(
  locationIds: string[],
  updates: {
    country_code?: string
    timezone?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const errors: string[] = []

  for (const locationId of locationIds) {
    const { error } = await supabase
      .schema('organization')
      .from('location_addresses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('location_id', locationId)

    if (error) {
      errors.push(`Failed to update location ${locationId}: ${error.message}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }

  revalidatePath('/business/locations')
  return { success: true, updated: locationIds.length }
}

export async function geocodeAllAddresses(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get all locations for this salon without coordinates
  const { data: locations, error: locationsError } = await supabase
    .from('salon_locations')
    .select('id, street_address, city, state_province, postal_code, country_code')
    .eq('salon_id', salonId)
    .is('latitude', null)

  if (locationsError) throw locationsError

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  // Note: In production, you'd use Google Geocoding API here
  // For now, we'll just mark them as needing manual geocoding
  for (const location of locations || []) {
    results.failed++
    results.errors.push(`Location ${location.id} needs manual geocoding`)
  }

  revalidatePath('/business/locations')
  return results
}
