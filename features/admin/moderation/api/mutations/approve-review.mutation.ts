'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

/**
 * Approve flagged review and mark as verified
 * Unflag and restore if previously flagged
 */
export async function approveReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()

    if (!reviewId) {
      return { error: 'Review ID is required' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    // Get review details
    const { data: review } = await supabase
      .from('salon_reviews')
      .select('customer_id, salon_id, is_flagged')
      .eq('id', reviewId)
      .single()

    if (!review) {
      return { error: 'Review not found' }
    }

    // Approve review (unflag, verify, restore if hidden)
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        is_flagged: false,
        flagged_reason: null,
        is_verified: true,
        deleted_at: null, // Restore if hidden
      })
      .eq('id', reviewId)

    if (error) return { error: error.message }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'review_approved',
      event_category: 'business',
      severity: 'info',
      user_id: session.user.id,
      action: 'approve_review',
      entity_type: 'review',
      entity_id: reviewId,
      metadata: {
        was_flagged: review.is_flagged,
        customer_id: review.customer_id,
        salon_id: review.salon_id,
        approved_by: session.user.id,
      },
      is_success: true,
    })

    revalidatePath('/admin/moderation')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to approve review',
    }
  }
}
