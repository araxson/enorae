'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

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
  try {
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
        response,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews', 'page')
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
 * Flag a review
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<ActionResponse> {
  try {
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
        flagged_reason: reason,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error flagging review:', error)
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
  try {
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
        is_featured: featured,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error toggling featured review:', error)
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
  try {
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
        response,
        response_date: new Date().toISOString(),
        responded_by_id: user.id,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

    if (error) throw error

    revalidatePath('/business/reviews', 'page')
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
    console.error('Error deleting review response:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete response',
    }
  }
}
