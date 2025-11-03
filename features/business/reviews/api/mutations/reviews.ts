'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import { reviewResponseSchema, flagReviewSchema, toggleFeaturedSchema } from '../schema'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

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
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid input', 'validation')
      return { success: false, error: firstError?.message ?? 'Invalid response' }
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

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response: validatedResponse,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
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
      error: error instanceof Error ? error.message : 'Failed to respond to review',
    }
  }
}

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
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid input', 'validation')
      return { success: false, error: firstError?.message ?? 'Invalid reason' }
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
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid input', 'validation')
      return { success: false, error: 'Invalid featured status' }
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
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid input', 'validation')
      return { success: false, error: firstError?.message ?? 'Invalid response' }
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

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response: validatedResponse,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
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
      error: error instanceof Error ? error.message : 'Failed to update response',
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

    if (error) throw error

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete response',
    }
  }
}
