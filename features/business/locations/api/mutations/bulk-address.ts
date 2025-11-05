'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability'

export async function bulkUpdateAddresses(
  locationIds: string[],
  updates: {
    country_code?: string
    timezone?: string
  }
) {
  const logger = createOperationLogger('bulkUpdateAddresses', {})

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.error('Authentication failed', 'auth', { locationCount: locationIds.length })
      throw new Error('Unauthorized')
    }

    logger.start({ userId: user.id, locationCount: locationIds.length, updates })

    // PERFORMANCE FIX: Use single batch update instead of N+1
    const { error } = await supabase
      .schema('organization')
      .from('location_addresses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in('location_id', locationIds)

    if (error) {
      logger.error(error, 'database', { userId: user.id, locationCount: locationIds.length })
      throw new Error(`Failed to bulk update locations: ${error.message}`)
    }

    // Mutation completed successfully - no explicit log needed, logger.success will handle it

    revalidatePath('/business/locations', 'page')

    logger.success({ userId: user.id, updatedCount: locationIds.length })
    return { success: true, updated: locationIds.length }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { locationCount: locationIds.length })
    throw error
  }
}

type GeocodeResult = {
  success: number
  failed: number
  errors: string[]
}

export async function geocodeAllAddresses(salonId: string): Promise<GeocodeResult> {
  const logger = createOperationLogger('geocodeAllAddresses', { salonId })

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.error('Authentication failed', 'auth', { salonId })
      throw new Error('Unauthorized')
    }

    logger.start({ salonId, userId: user.id })

    // Get all locations for this salon without coordinates
    const { data: locations, error: locationsError } = await supabase
      .from('salon_locations_view')
      .select('id')
      .eq('salon_id', salonId)
      .is('latitude', null)

    if (locationsError) {
      logger.error(locationsError, 'database', { salonId, userId: user.id })
      throw locationsError
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Note: In production, you'd use Google Geocoding API here
    // For now, we'll just mark them as needing manual geocoding
    const locationRows = (locations ?? []) as Array<{ id: string }>

    for (const location of locationRows) {
      results.failed++
      results.errors.push(`Location ${location.id} needs manual geocoding`)
    }

    logger.warn('Geocoding not implemented - manual action required', {
      salonId,
      userId: user.id,
      failedCount: results.failed
    })

    revalidatePath('/business/locations', 'page')
    return results
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    throw error
  }
}
