'use server'

import { z } from 'zod'
import { UUID_REGEX } from '@/lib/validations/patterns'
import { resolveAdminClient, resolveAdminSession } from './shared'
import { validateReviewId, flagReview as flagReviewOp } from '@/features/admin/moderation/api/moderation-factory'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

const flagReviewSchema = z.object({
  reviewId: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  reason: z.string().min(1).max(500),
})

export async function flagReview(formData: FormData) {
  const logger = createOperationLogger('flagReview', {})
  logger.start()

  try {
    const result = flagReviewSchema.safeParse({
      reviewId: formData.get('reviewId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed', fieldErrors }
    }

    const session = await resolveAdminSession()
    const supabase = await resolveAdminClient()

    const { reviewId, reason } = result.data

    return await flagReviewOp(supabase, {
      userId: session.user.id,
      reviewId,
      reason,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to flag review' }
  }
}
