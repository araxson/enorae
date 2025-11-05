'use server'

import { sanitizeAdminText } from '@/features/admin/common'
import { resolveAdminClient, resolveAdminSession } from './shared'
import { validateReviewId, deleteReview as deleteReviewOp } from '@/features/admin/moderation/api/moderation-factory'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function deleteReview(formData: FormData) {
  const logger = createOperationLogger('deleteReview', {})
  logger.start()

  try {
    const reviewId = formData.get('reviewId')?.toString()
    if (!validateReviewId(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    const reason = sanitizeAdminText(formData.get('reason')?.toString(), 'No reason provided')

    const session = await resolveAdminSession()
    const supabase = await resolveAdminClient()

    return await deleteReviewOp(supabase, {
      userId: session.user.id,
      reviewId,
      reason,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete review' }
  }
}
