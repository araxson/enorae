'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const flagReviewSchema = z.object({
  reviewId: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  reason: z.string().min(1).max(500),
})

const respondToReviewSchema = z.object({
  reviewId: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  response: z.string().min(1).max(1000),
})

/**
 * Flag review for moderation
 * SECURITY: Platform admin only
 */
export async function flagReview(formData: FormData) {
  try {
    const result = flagReviewSchema.safeParse({
      reviewId: formData.get('reviewId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { reviewId, reason } = result.data

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        is_flagged: true,
        flagged_reason: reason,
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to flag review',
    }
  }
}

/**
 * Unflag review
 * SECURITY: Platform admin only
 */
export async function unflagReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    if (!reviewId || !UUID_REGEX.test(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    // SECURITY: Require platform admin
    await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        is_flagged: false,
        flagged_reason: null,
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to unflag review',
    }
  }
}

/**
 * Respond to review as admin
 * SECURITY: Platform admin only
 */
export async function respondToReview(formData: FormData) {
  try {
    const result = respondToReviewSchema.safeParse({
      reviewId: formData.get('reviewId')?.toString(),
      response: formData.get('response')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { reviewId, response } = result.data

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response: response,
        response_date: new Date().toISOString(),
        responded_by_id: session.user.id,
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to respond to review',
    }
  }
}

/**
 * Delete review
 * SECURITY: Platform admin only
 */
export async function deleteReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    if (!reviewId || !UUID_REGEX.test(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    // SECURITY: Require platform admin
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete review',
    }
  }
}

/**
 * Feature review (highlight as example)
 * SECURITY: Platform admin only
 */
export async function featureReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    const isFeatured = formData.get('isFeatured') === 'true'

    if (!reviewId || !UUID_REGEX.test(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    // SECURITY: Require platform admin
    await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = await createClient()

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        is_featured: isFeatured,
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to feature review',
    }
  }
}
