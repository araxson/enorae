'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { getRequiredString } from '@/lib/utils/safe-form-data'
import { validateAddImage } from './helpers'

export async function addGalleryImage(formData: FormData) {
  const logger = createOperationLogger('addGalleryImage', {})
  logger.start()

  try {
    // Step 1: Authentication
    try {
      await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    } catch (authError) {
      const errorMsg = authError instanceof Error ? authError.message : 'Authentication failed'
      logger.error(authError instanceof Error ? authError : String(authError), 'auth')
      return { error: `Authentication error: ${errorMsg}` }
    }

    const supabase = await createClient()

    // Step 2: Extract form data
    let salonId: string
    let imageUrl: string
    try {
      salonId = getRequiredString(formData, 'salonId')
      imageUrl = getRequiredString(formData, 'imageUrl')
    } catch (extractError) {
      const errorMsg = extractError instanceof Error ? extractError.message : 'Invalid form data'
      logger.error(extractError instanceof Error ? extractError : String(extractError), 'validation')
      return { error: `Form data error: ${errorMsg}` }
    }

    // Step 3: Validate inputs
    const validation = validateAddImage({ salonId, imageUrl })
    if (!validation.success) {
      logger.error(validation.error, 'validation')
      return { error: validation.error }
    }

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

    // Step 5: Fetch current gallery
    const { data: media, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_media')
      .select('gallery_urls')
      .eq('salon_id', salonId)
      .single<{ gallery_urls: string[] | null }>()

    if (fetchError && fetchError.code !== 'PGRST116') {
      logger.error(fetchError, 'database')
      return {
        error: `Database error fetching gallery: ${fetchError.message} (Code: ${fetchError.code})`,
      }
    }

    // Step 6: Update gallery
    const currentGallery = media?.gallery_urls ?? []

    // Check for duplicate
    if (currentGallery.includes(imageUrl)) {
      logger.error('Duplicate image URL', 'validation')
      return { error: 'Image already exists in gallery' }
    }

    const updatedGallery = [...currentGallery, imageUrl]

    const { error: updateError } = await supabase
      .schema('organization')
      .from('salon_media')
      .upsert({
        salon_id: salonId,
        gallery_urls: updatedGallery,
      })

    if (updateError) {
      logger.error(updateError, 'database')
      return {
        error: `Database error adding image: ${updateError.message} (Code: ${updateError.code})`,
      }
    }

    // Step 7: Revalidate and return success
    revalidatePath('/business/settings/media', 'page')
    logger.success({ success: true })
    return { success: true }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error adding image'
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: `Failed to add image: ${errorMsg}` }
  }
}
