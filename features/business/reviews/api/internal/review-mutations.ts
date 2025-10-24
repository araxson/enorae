'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { ActionResponse } from './types'
import { verifyReviewAccess } from './helpers'

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

    const hasAccess = await verifyReviewAccess(reviewId, salonId)
    if (!hasAccess) {
      return { success: false, error: 'Review not found or access denied' }
    }

    const supabase = await createClient()
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
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
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
        is_featured: featured,
      })
      .eq('id', reviewId)
      .eq('salon_id', salonId)

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
