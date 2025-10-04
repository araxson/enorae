'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

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
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('review_helpful_votes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', session.user.id)
      .single()

    if (existingVote) {
      return { success: false, error: 'You already marked this review as helpful', alreadyVoted: true }
    }

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

    // Increment the helpful_count
    const { data: review, error: fetchError } = await supabase
      .from('salon_reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single<{ helpful_count: number | null }>()

    if (fetchError) throw fetchError

    const currentCount = review?.helpful_count || 0

    const { error: updateError } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        helpful_count: currentCount + 1,
      })
      .eq('id', reviewId)

    if (updateError) throw updateError

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
    const session = await requireAuth()
    const supabase = await createClient()

    // Delete the vote record
    const { error: deleteError } = await supabase
      .schema('engagement')
      .from('review_helpful_votes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', session.user.id)

    if (deleteError) throw deleteError

    // Decrement the helpful_count
    const { data: review, error: fetchError } = await supabase
      .from('salon_reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single<{ helpful_count: number | null }>()

    if (fetchError) throw fetchError

    const currentCount = review?.helpful_count || 0

    if (currentCount > 0) {
      const { error: updateError } = await supabase
        .schema('engagement')
        .from('salon_reviews')
        .update({
          helpful_count: currentCount - 1,
        })
        .eq('id', reviewId)

      if (updateError) throw updateError
    }

    revalidatePath('/customer/salons/[slug]', 'page')

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to remove helpful vote' }
  }
}
