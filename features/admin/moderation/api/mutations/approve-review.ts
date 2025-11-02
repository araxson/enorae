'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { validateReviewId, approveReview as approveReviewOp } from '@/features/admin/moderation/api/moderation-factory'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

/**
 * Approve flagged review and mark as verified
 * Unflag and restore if previously flagged
 */
export async function approveReview(formData: FormData) {
  const logger = createOperationLogger('approveReview', {})
  logger.start()

  try {
    const reviewId = formData.get('reviewId')?.toString()

    if (!validateReviewId(reviewId)) {
      return { error: 'Review ID is required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    return await approveReviewOp(supabase, {
      userId: session.user.id,
      reviewId,
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to approve review',
    }
  }
}
