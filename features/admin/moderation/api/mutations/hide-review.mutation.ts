'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

/**
 * Hide review from public view (soft delete)
 * Requires reason for moderation tracking
 */
export async function hideReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    const reason = formData.get('reason')?.toString()

    if (!reviewId) {
      return { error: 'Review ID is required' }
    }

    if (!reason) {
      return { error: 'Reason for hiding is required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    // Get review details for audit
    const { data: review } = await supabase
      .from('salon_reviews_view')
      .select('customer_id, salon_id, rating, comment')
      .eq('id', reviewId)
      .single()

    if (!review) {
      return { error: 'Review not found' }
    }

    const timestamp = new Date().toISOString()

    // Hide review (soft delete)
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews_view')
      .update({
        deleted_at: timestamp,
        deleted_by_id: session.user.id,
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'review_hidden',
      event_category: 'business',
      severity: 'warning',
      user_id: session.user.id,
      action: 'hide_review',
      entity_type: 'review',
      entity_id: reviewId,
      target_schema: 'engagement',
      target_table: 'salon_reviews',
      metadata: {
        reason,
        customer_id: review.customer_id,
        salon_id: review.salon_id,
        rating: review.rating,
        hidden_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to hide review',
    }
  }
}
