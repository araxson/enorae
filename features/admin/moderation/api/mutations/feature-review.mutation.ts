'use server'

import { revalidatePath } from 'next/cache'
import { resolveAdminClient, UUID_REGEX, MODERATION_PATHS } from './shared'

export async function featureReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    const isFeatured = formData.get('isFeatured') === 'true'

    if (!reviewId || !UUID_REGEX.test(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    const supabase = await resolveAdminClient()

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({ is_featured: isFeatured })
      .eq('id', reviewId)

    if (error) {
      return { error: error.message }
    }

    MODERATION_PATHS.forEach((path) => revalidatePath(path))
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to feature review' }
  }
}
