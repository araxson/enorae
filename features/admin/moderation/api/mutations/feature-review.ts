'use server'

import { resolveAdminClient, resolveAdminSession } from './shared'
import { validateReviewId, featureReview as featureReviewOp } from '@/features/admin/moderation/api/moderation-factory'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function featureReview(formData: FormData) {
  const logger = createOperationLogger('featureReview', {})
  logger.start()

  try {
    const reviewId = formData.get('reviewId')?.toString()

    if (!validateReviewId(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    const session = await resolveAdminSession()
    const supabase = await resolveAdminClient()

    return await featureReviewOp(supabase, {
      userId: session.user.id,
      reviewId,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to feature review' }
  }
}
