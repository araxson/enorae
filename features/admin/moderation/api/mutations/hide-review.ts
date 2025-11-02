'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { validateReviewId, hideReview as hideReviewOp } from '@/features/admin/moderation/api/moderation-factory'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

/**
 * Hide review from public view (soft delete)
 * Requires reason for moderation tracking
 */
export async function hideReview(formData: FormData) {
  const logger = createOperationLogger('hideReview', {})
  logger.start()

  try {
    const reviewId = formData.get('reviewId')?.toString()
    const reason = formData.get('reason')?.toString()

    if (!validateReviewId(reviewId)) {
      return { error: 'Review ID is required' }
    }

    if (!reason) {
      return { error: 'Reason for hiding is required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    return await hideReviewOp(supabase, {
      userId: session.user.id,
      reviewId,
      reason,
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to hide review',
    }
  }
}
