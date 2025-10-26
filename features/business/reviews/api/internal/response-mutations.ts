'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { ActionResponse } from './types'
import { verifyReviewAccess, verifyReviewHasResponse } from '@/lib/utils/review-access'

/**
 * Respond to a review
 */
export async function respondToReview(
  reviewId: string,
  response: string
): Promise<ActionResponse> {
  try {
    const { user } = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const hasAccess = await verifyReviewAccess(reviewId, salonId)
    if (!hasAccess) {
      return { success: false, error: 'Review not found or access denied' }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error responding to review:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to respond to review',
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
  try {
    const { user } = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const { exists, response: existingResponse } = await verifyReviewHasResponse(reviewId, salonId)
    if (!exists) {
      return { success: false, error: 'Review not found or access denied' }
    }

    if (!existingResponse) {
      return { success: false, error: 'No response exists to update' }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating review response:', error)
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
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const { exists, response: existingResponse } = await verifyReviewHasResponse(reviewId, salonId)
    if (!exists) {
      return { success: false, error: 'Review not found or access denied' }
    }

    if (!existingResponse) {
      return { success: false, error: 'No response exists to delete' }
    }

    const supabase = await createClient()
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

    revalidatePath('/business/reviews')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error deleting review response:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete response',
    }
  }
}
