'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { getRequiredString, getOptionalString } from '@/lib/utils/safe-form-data'
import { validateUpdateMedia, type UpdateMediaValidation } from './helpers'

export async function updateSalonMedia(formData: FormData) {
  const logger = createOperationLogger('updateSalonMedia', {})
  logger.start()

  try {
    // Step 1: Authentication check
    try {
      await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    } catch (authError) {
      const errorMsg = authError instanceof Error ? authError.message : 'Authentication failed'
      logger.error(authError instanceof Error ? authError : String(authError), 'auth')
      return { error: `Authentication error: ${errorMsg}` }
    }

    const supabase = await createClient()

    // Step 2: Extract and validate form data
    let salonId: string
    try {
      salonId = getRequiredString(formData, 'salonId')
    } catch (extractError) {
      const errorMsg = extractError instanceof Error ? extractError.message : 'Invalid salonId'
      logger.error(extractError instanceof Error ? extractError : String(extractError), 'validation')
      return { error: `Form data error: ${errorMsg}` }
    }

    const logo_url = getOptionalString(formData, 'logo_url')
    const cover_image_url = getOptionalString(formData, 'cover_image_url')
    const video_url = getOptionalString(formData, 'video_url')
    const brand_colors = getOptionalString(formData, 'brand_colors')

    // Step 3: Validate complete media data
    const validation = validateUpdateMedia({
      salonId,
      logo_url,
      cover_image_url,
      video_url,
      brand_colors,
    })

    if (!validation.success) {
      logger.error(validation.error, 'validation')
      return { error: validation.error }
    }

    const validatedData = validation.data as UpdateMediaValidation

    // Step 4: Verify authorization
    try {
      if (!(await canAccessSalon(salonId))) {
        logger.error('Unauthorized salon access attempt', 'auth')
        return { error: 'Unauthorized: You do not have access to this salon' }
      }
    } catch (authCheckError) {
      const errorMsg = authCheckError instanceof Error ? authCheckError.message : 'Authorization check failed'
      logger.error(authCheckError instanceof Error ? authCheckError : String(authCheckError), 'auth')
      return { error: `Authorization error: ${errorMsg}` }
    }

    // Step 5: Execute database operation
    const { error } = await supabase
      .schema('organization')
      .from('salon_media')
      .upsert({
        salon_id: salonId,
        logo_url: validatedData.logo_url || null,
        cover_image_url: validatedData.cover_image_url || null,
        video_url: validatedData.video_url || null,
        brand_colors: validatedData.brand_colors || null,
      })

    if (error) {
      logger.error(error, 'database')
      return {
        error: `Database error updating media: ${error.message} (Code: ${error.code})`,
      }
    }

    // Step 6: Revalidate and return success
    revalidatePath('/business/settings/media', 'page')
    logger.success({ success: true })
    return { success: true }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error updating media'
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: `Failed to update media: ${errorMsg}` }
  }
}
