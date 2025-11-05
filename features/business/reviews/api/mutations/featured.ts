'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { toggleFeaturedSchema } from '../schema'
import type { ActionResponse } from './types'

/**
 * Feature/unfeature a review
 */
export async function toggleFeaturedReview(
  reviewId: string,
  featured: boolean
): Promise<ActionResponse> {
  const logger = createOperationLogger('toggleFeaturedReview', {})
  logger.start()

  try {
    // SECURITY: Validate input before processing
    const validation = toggleFeaturedSchema.safeParse({ featured })
    if (!validation.success) {
      logger.error('Validation failed', 'validation')
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const validatedFeatured = validation.data.featured

    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const supabase = await createClient()

    // Verify the review belongs to the active salon
    const { data: review } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('salon_id')
      .eq('id', reviewId)
      .eq('salon_id', salonId)
      .single()

    if (!review) {
      return { success: false, error: 'Review not found or access denied' }
    }

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        is_featured: validatedFeatured,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update review',
    }
  }
}
