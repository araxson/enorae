'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { flagReviewSchema } from '../schema'
import type { ActionResponse } from './types'

/**
 * Flag a review
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<ActionResponse> {
  const logger = createOperationLogger('flagReview', {})
  logger.start()

  try {
    // SECURITY: Validate input before processing
    const validation = flagReviewSchema.safeParse({ reason })
    if (!validation.success) {
      logger.error('Validation failed', 'validation')
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const validatedReason = validation.data.reason

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
        is_flagged: true,
        flagged_reason: validatedReason,
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
      error: error instanceof Error ? error.message : 'Failed to flag review',
    }
  }
}
