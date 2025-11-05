'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

type ActionResult = {
  success?: boolean
  error?: string
  alreadyVoted?: boolean
}

/**
 * Mark a review as helpful
 * Uses junction table to track votes and prevent duplicates
 */
export async function markReviewAsHelpful(reviewId: string): Promise<ActionResult> {
  const logger = createOperationLogger('markReviewAsHelpful', {})
  logger.start()

  try {
    // Parallel execution: fetch session and supabase client simultaneously
    const [session, supabase] = await Promise.all([
      requireAuth(),
      createClient()
    ])

    // Insert vote record (prevents duplicates via UNIQUE constraint)
    const { error: voteError } = await supabase
      .schema('engagement')
      .from('review_helpful_votes')
      .insert({
        review_id: reviewId,
        user_id: session.user.id,
      })

    if (voteError) {
      // Duplicate key error means user already voted
      if (voteError.code === '23505') {
        return { success: false, error: 'You already marked this review as helpful', alreadyVoted: true }
      }
      throw voteError
    }

    // Note: helpful_count is calculated dynamically from review_helpful_votes table
    // The salon_reviews_with_counts view aggregates this automatically

    revalidatePath('/customer/salons/[slug]', 'page')

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to mark review as helpful' }
  }
}

/**
 * Remove helpful vote from a review
 */
export async function unmarkReviewAsHelpful(reviewId: string): Promise<ActionResult> {
  try {
    // Parallel execution: fetch session and supabase client simultaneously
    const [session, supabase] = await Promise.all([
      requireAuth(),
      createClient()
    ])

    // Delete the vote record
    const { error: deleteError } = await supabase
      .schema('engagement')
      .from('review_helpful_votes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', session.user.id)

    if (deleteError) throw deleteError

    // Note: helpful_count is calculated dynamically from review_helpful_votes table
    // The salon_reviews_with_counts view aggregates this automatically

    revalidatePath('/customer/salons/[slug]', 'page')

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to remove helpful vote' }
  }
}
