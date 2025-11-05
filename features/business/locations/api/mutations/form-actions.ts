'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { canAccessSalon } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

/**
 * Server Action form state type
 */
type FormState = {
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
}

/**
 * Address form schema - server-side validation
 */
const addressFormSchema = z.object({
  street_address: z
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address is too long')
    .transform(val => val.trim()),
  address_line_2: z
    .string()
    .max(200, 'Address line 2 is too long')
    .optional()
    .transform(val => val?.trim() || undefined),
  city: z
    .string()
    .min(2, 'City name must be at least 2 characters')
    .max(100, 'City name is too long')
    .transform(val => val.trim()),
  state: z
    .string()
    .min(2, 'State/Province must be at least 2 characters')
    .max(100, 'State name is too long')
    .transform(val => val.trim()),
  postal_code: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code is too long')
    .regex(/^[A-Z0-9\s-]+$/i, 'Postal code can only contain letters, numbers, spaces, and hyphens')
    .transform(val => val.trim()),
  country: z
    .string()
    .length(2, 'Country must be a 2-letter code (e.g., US, CA, GB)')
    .regex(/^[A-Z]{2}$/i, 'Country must be uppercase 2-letter code')
    .transform((val) => val.toUpperCase()),
  latitude: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional()
    .transform(val => val || undefined),
  longitude: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional()
    .transform(val => val || undefined),
})
  .refine(
    (data) => {
      // If latitude is provided, longitude must also be provided (and vice versa)
      if ((data.latitude === undefined) !== (data.longitude === undefined)) {
        return false
      }
      return true
    },
    {
      message: 'Both latitude and longitude must be provided together',
      path: ['latitude'],
    }
  )

/**
 * Update location address Server Action
 */
export async function updateLocationAddressAction(
  locationId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('updateLocationAddressAction', { locationId })
  logger.start()

  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        message: 'You must be logged in to update location address',
        success: false,
      }
    }

    // Get location to check access
    const { data: location, error: locationError } = await supabase
      .schema('organization')
      .from('salon_locations')
      .select('salon_id')
      .eq('id', locationId)
      .single()

    if (locationError || !location) {
      return {
        message: 'Location not found',
        success: false,
      }
    }

    // Check salon access
    const salonId = location?.salon_id
    if (!salonId || !(await canAccessSalon(salonId))) {
      logger.error('Unauthorized access attempt', 'permission', { userId: user.id })
      return {
        message: 'Unauthorized: You do not have access to this location',
        success: false,
      }
    }

    // Parse and validate form data
    const parsed = addressFormSchema.safeParse({
      street_address: formData.get('street_address'),
      address_line_2: formData.get('address_line_2'),
      city: formData.get('city'),
      state: formData.get('state'),
      postal_code: formData.get('postal_code'),
      country: formData.get('country'),
      latitude: formData.get('latitude'),
      longitude: formData.get('longitude'),
    })

    if (!parsed.success) {
      logger.error('Validation failed', 'validation', {
        errors: parsed.error.flatten().fieldErrors,
      })
      return {
        message: 'Please fix the errors below',
        errors: parsed.error.flatten().fieldErrors,
        success: false,
      }
    }

    const data = parsed.data
    const timestamp = new Date().toISOString()

    // Create formatted address
    const formattedAddress = [
      data.street_address,
      data.address_line_2,
      data.city,
      data.state,
      data.postal_code,
      data.country,
    ]
      .filter(Boolean)
      .join(', ')

    // NOTE: geography.addresses table doesn't exist in database schema yet
    // This feature is not yet fully implemented
    // TODO: Implement when geography schema and addresses table are added
    logger.error('Address update feature not fully implemented', 'not_found', { locationId, userId: user.id })
    return {
      message: 'Address update feature is not yet available. Please check back later.',
      success: false,
    }

    // FUTURE IMPLEMENTATION (when geography schema exists):
    // const { error: addressError } = await supabase
    //   .schema('geography')
    //   .from('addresses')
    //   .upsert({
    //     location_id: locationId,
    //     street_address: data.street_address,
    //     street_address_2: data.address_line_2 ?? null,
    //     city: data.city,
    //     state_province: data.state,
    //     postal_code: data.postal_code,
    //     country_code: data.country,
    //     formatted_address: formattedAddress,
    //     latitude: data.latitude ?? null,
    //     longitude: data.longitude ?? null,
    //     updated_at: timestamp,
    //   })
    //
    // if (addressError) {
    //   logger.error('Address update failed', 'database', { error: addressError })
    //   return {
    //     message: addressError.message || 'Failed to update address',
    //     success: false,
    //   }
    // }
    //
    // logger.success({ locationId })
    //
    // revalidatePath('/business/locations')
    //
    // return {
    //   message: 'Address updated successfully',
    //   success: true,
    // }
  } catch (error: unknown) {
    logger.error('Unexpected error', 'system', { error })
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false,
    }
  }
}
