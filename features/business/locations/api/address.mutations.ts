'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface AddressInput {
  street_address: string
  street_address_2?: string | null
  city: string
  state_province: string
  postal_code: string
  country_code?: string
  latitude?: number | null
  longitude?: number | null
  formatted_address?: string | null
  place_id?: string | null
  neighborhood?: string | null
  landmark?: string | null
  parking_instructions?: string | null
  accessibility_notes?: string | null
}

export async function updateLocationAddress(
  locationId: string,
  input: AddressInput
): Promise<ActionResponse> {
  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    // Verify location ownership through salon
    const { data: location } = await supabase
      .from('salon_locations')
      .select('salon_id')
      .eq('id', locationId)
      .single<{ salon_id: string | null }>()

    if (!location?.salon_id) {
      return { success: false, error: 'Location not found' }
    }

    if (!(await canAccessSalon(location.salon_id))) {
      return { success: false, error: 'Unauthorized: Not your location' }
    }

    // Check if address exists
    const { data: existing } = await supabase
      .schema('organization')
      .from('location_addresses')
      .select('location_id')
      .eq('location_id', locationId)
      .single()

    if (existing) {
      // Update existing address
      const { error } = await supabase
        .schema('organization')
        .from('location_addresses')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
          updated_by_id: session.user.id,
        })
        .eq('location_id', locationId)

      if (error) throw error
    } else {
      // Insert new address
      const { error } = await supabase
        .schema('organization')
        .from('location_addresses')
        .insert({
          location_id: locationId,
          ...input,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })

      if (error) throw error
    }

    revalidatePath('/business/locations')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating location address:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update address',
    }
  }
}

export async function deleteLocationAddress(locationId: string): Promise<ActionResponse> {
  try {
    // SECURITY: Require business user role
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    // Verify location ownership through salon
    const { data: location } = await supabase
      .from('salon_locations')
      .select('salon_id')
      .eq('id', locationId)
      .single<{ salon_id: string | null }>()

    if (!location?.salon_id) {
      return { success: false, error: 'Location not found' }
    }

    if (!(await canAccessSalon(location.salon_id))) {
      return { success: false, error: 'Unauthorized: Not your location' }
    }

    const { error } = await supabase
      .schema('organization')
      .from('location_addresses')
      .delete()
      .eq('location_id', locationId)

    if (error) throw error

    revalidatePath('/business/locations')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error deleting location address:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete address',
    }
  }
}
