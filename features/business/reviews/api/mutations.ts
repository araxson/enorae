'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

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
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Verify the review belongs to this salon
    const { data: review } = await supabase
      .from('salon_reviews')
      .select('salon_id')
      .eq('id', reviewId)
      .single<{ salon_id: string }>()

    if (!review || review.salon_id !== staffProfile.salon_id) {
      return { success: false, error: 'Review not found or access denied' }
    }

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response,
        response_date: new Date().toISOString(),
        responded_by_id: session.user.id,
      })
      .eq('id', reviewId)

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
 * Flag a review
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<ActionResponse> {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Verify the review belongs to this salon
    const { data: review } = await supabase
      .from('salon_reviews')
      .select('salon_id')
      .eq('id', reviewId)
      .single<{ salon_id: string }>()

    if (!review || review.salon_id !== staffProfile.salon_id) {
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

    if (error) throw error

    revalidatePath('/business/reviews')
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
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Verify the review belongs to this salon
    const { data: review } = await supabase
      .from('salon_reviews')
      .select('salon_id')
      .eq('id', reviewId)
      .single<{ salon_id: string }>()

    if (!review || review.salon_id !== staffProfile.salon_id) {
      return { success: false, error: 'Review not found or access denied' }
    }

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        is_featured: featured,
      })
      .eq('id', reviewId)

    if (error) throw error

    revalidatePath('/business/reviews')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error toggling featured review:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update review',
    }
  }
}
