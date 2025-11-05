'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { reviewResponseSchema } from '../schema'
import type { ActionResponse } from './types'
import { sanitizeText } from '@/lib/utils/sanitize'

/**
 * Respond to a review
 */
export async function respondToReview(
  reviewId: string,
  response: string
): Promise<ActionResponse> {
  const logger = createOperationLogger('respondToReview', {})
  logger.start()

  try {
    // SECURITY: Validate input before processing
    const validation = reviewResponseSchema.safeParse({ response })
    if (!validation.success) {
      logger.error('Validation failed', 'validation')
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const validatedResponse = validation.data.response

    const { user } = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
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

    // SECURITY: Sanitize response to prevent XSS
    const sanitizedResponse = sanitizeText(validatedResponse)

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response: sanitizedResponse,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) {
      console.error('Database error responding to review:', error)
      return { success: false, error: 'Failed to respond to review. Please try again.' }
    }

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: 'Failed to respond to review. Please try again.',
    }
  }
}

/**
 * Update a review response
 */
export async function updateReviewResponse(
  reviewId: string,
  response: string
): Promise<ActionResponse> {
  const logger = createOperationLogger('updateReviewResponse', {})
  logger.start()

  try {
    // SECURITY: Validate input before processing
    const validation = reviewResponseSchema.safeParse({ response })
    if (!validation.success) {
      logger.error('Validation failed', 'validation')
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const validatedResponse = validation.data.response

    const { user } = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const supabase = await createClient()

    // Verify the review belongs to the active salon and has a response
    const { data: review } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('salon_id, response')
      .eq('id', reviewId)
      .eq('salon_id', salonId)
      .single<{ salon_id: string; response: string | null }>()

    if (!review) {
      return { success: false, error: 'Review not found or access denied' }
    }

    if (!review.response) {
      return { success: false, error: 'No response exists to update' }
    }

    // SECURITY: Sanitize response to prevent XSS
    const sanitizedResponse = sanitizeText(validatedResponse)

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response: sanitizedResponse,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) {
      console.error('Database error updating review response:', error)
      return { success: false, error: 'Failed to update response. Please try again.' }
    }

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: 'Failed to update response. Please try again.',
    }
  }
}

/**
 * Delete a review response
 */
export async function deleteReviewResponse(
  reviewId: string
): Promise<ActionResponse> {
  const logger = createOperationLogger('deleteReviewResponse', {})
  logger.start()

  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const supabase = await createClient()

    // Verify the review belongs to the active salon and has a response
    const { data: review } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .select('salon_id, response')
      .eq('id', reviewId)
      .eq('salon_id', salonId)
      .single<{ salon_id: string; response: string | null }>()

    if (!review) {
      return { success: false, error: 'Review not found or access denied' }
    }

    if (!review.response) {
      return { success: false, error: 'No response exists to delete' }
    }

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response: null,
        response_date: null,
        responded_by_id: null,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) {
      console.error('Database error deleting review response:', error)
      return { success: false, error: 'Failed to delete response. Please try again.' }
    }

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: 'Failed to delete response. Please try again.',
    }
  }
}
