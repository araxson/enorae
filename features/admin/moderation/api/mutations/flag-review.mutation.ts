import 'server-only'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveAdminClient, UUID_REGEX, MODERATION_PATHS } from './shared'

const flagReviewSchema = z.object({
  reviewId: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  reason: z.string().min(1).max(500),
})

export async function flagReview(formData: FormData) {
  try {
    const result = flagReviewSchema.safeParse({
      reviewId: formData.get('reviewId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const supabase = await resolveAdminClient()

    const { reviewId, reason } = result.data

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({ is_flagged: true, flagged_reason: reason })
      .eq('id', reviewId)

    if (error) {
      return { error: error.message }
    }

    MODERATION_PATHS.forEach((path) => revalidatePath(path))
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to flag review' }
  }
}
