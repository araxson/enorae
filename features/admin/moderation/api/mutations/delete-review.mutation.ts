'use server'

import { revalidatePath } from 'next/cache'
import { sanitizeAdminText } from '@/features/admin/admin-common'
import { resolveAdminClient, resolveAdminSession, UUID_REGEX, MODERATION_PATHS } from './shared'

export async function deleteReview(formData: FormData) {
  try {
    const reviewId = formData.get('reviewId')?.toString()
    if (!reviewId || !UUID_REGEX.test(reviewId)) {
      return { error: 'Invalid review ID' }
    }

    const reason = sanitizeAdminText(formData.get('reason')?.toString(), 'No reason provided')

    const session = await resolveAdminSession()
    const supabase = await resolveAdminClient()

    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', reviewId)

    if (error) {
      return { error: error.message }
    }

    const { error: auditError } = await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'review_deleted',
      event_category: 'moderation',
      severity: 'warning',
      user_id: session.user.id,
      action: 'delete_review',
      entity_type: 'review',
      entity_id: reviewId,
      metadata: {
        deleted_by: session.user.id,
        reason,
      },
      is_success: true,
    })

    if (auditError) {
      console.error('[Moderation] Failed to record audit log for review deletion', auditError)
    }

    MODERATION_PATHS.forEach((path) => revalidatePath(path))
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete review' }
  }
}
