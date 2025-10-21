'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

/**
 * Ban user from posting reviews
 * Hides the review and prevents future review submissions
 */
export async function banReviewAuthor(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    const reason = formData.get('reason')?.toString()

    if (!reviewId) {
      return { error: 'Review ID is required' }
    }

    if (!reason) {
      return { error: 'Ban reason is required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    // Get review and customer info
    const { data: review } = await supabase
      .from('salon_reviews_view')
      .select('customer_id, salon_id, rating, comment')
      .eq('id', reviewId)
      .single()

    if (!review || !review.customer_id) {
      return { error: 'Review not found or invalid customer' }
    }

    const timestamp = new Date().toISOString()

    // Hide the offending review
    await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        deleted_at: timestamp,
        deleted_by_id: session.user.id,
      })
      .eq('id', reviewId)

    // Mark user profile as restricted from reviews
    // Using metadata in profiles_metadata to track review ban
    const { data: profileMetadata } = await supabase
      .schema('identity')
      .from('profiles')
      .select('id')
      .eq('id', review.customer_id)
      .single()

    if (profileMetadata?.id) {
      await supabase
        .schema('identity')
        .from('profiles_metadata')
        .upsert({
          profile_id: profileMetadata.id,
          tags: ['review_banned'],
          updated_at: timestamp,
        })
    }

    // Critical audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'review_author_banned',
      event_category: 'security',
      severity: 'critical',
      user_id: session.user.id,
      action: 'ban_review_author',
      entity_type: 'user',
      entity_id: review.customer_id,
      target_schema: 'engagement',
      target_table: 'salon_reviews',
      metadata: {
        reason,
        review_id: reviewId,
        salon_id: review.salon_id,
        banned_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to ban review author',
    }
  }
}
