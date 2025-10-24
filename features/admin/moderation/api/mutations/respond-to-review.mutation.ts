import 'server-only'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveAdminClient, resolveAdminSession, UUID_REGEX, MODERATION_PATHS } from './shared'

const respondToReviewSchema = z.object({
  reviewId: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  response: z.string().min(1).max(1000),
})

export async function respondToReview(formData: FormData) {
  try {
    const result = respondToReviewSchema.safeParse({
      reviewId: formData.get('reviewId')?.toString(),
      response: formData.get('response')?.toString(),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const session = await resolveAdminSession()
    const supabase = await resolveAdminClient()

    const { reviewId, response } = result.data

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        response,
        response_date: new Date().toISOString(),
        responded_by_id: session.user.id,
      })
      .eq('id', reviewId)

    if (error) {
      return { error: error.message }
    }

    MODERATION_PATHS.forEach((path) => revalidatePath(path))
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to respond to review' }
  }
}
