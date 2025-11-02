import 'server-only'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { UUID_REGEX } from '@/lib/validations/patterns'
import type { Json } from '@/lib/types/database.types'

/**
 * Review moderation factory
 * Consolidates moderation operations used across 8+ admin mutation files
 */

export interface ModerationContext {
  userId: string
  reviewId: string
  reason?: string
}

export interface ModerationResult {
  success?: boolean
  error?: string
}

const MODERATION_PATHS = [
  '/admin/moderation',
  '/admin/moderation/reviews',
  '/admin/moderation/quality',
  '/admin/moderation/fraud',
] as const

/**
 * Validate review ID format
 */
export function validateReviewId(reviewId: string | null | undefined): reviewId is string {
  return !!reviewId && UUID_REGEX.test(reviewId)
}

/**
 * Record moderation audit log
 */
async function recordAuditLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: {
    userId: string
    reviewId: string
    action: string
    eventType: string
    severity: 'info' | 'warning' | 'error'
    metadata?: Record<string, unknown>
  }
): Promise<void> {
  const { error } = await supabase.schema('audit').from('audit_logs').insert({
    event_type: context.eventType,
    event_category: 'moderation',
    severity: context.severity,
    user_id: context.userId,
    action: context.action,
    entity_type: 'review',
    entity_id: context.reviewId,
    target_schema: 'engagement',
    target_table: 'salon_reviews',
    metadata: (context.metadata || {}) as Json,
    is_success: true,
  })

  if (error) {
    console.error('[Moderation] Failed to record audit log', error)
  }
}

/**
 * Update review status
 */
async function updateReviewStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reviewId: string,
  updates: Record<string, unknown>
): Promise<ModerationResult> {
  const { error } = await supabase
    .schema('engagement')
    .from('salon_reviews')
    .update(updates)
    .eq('id', reviewId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Revalidate moderation paths
 */
function revalidateModerationPaths() {
  MODERATION_PATHS.forEach((path) => revalidatePath(path, 'page'))
}

/**
 * Delete review (soft delete)
 */
export async function deleteReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: ModerationContext
): Promise<ModerationResult> {
  try {
    const result = await updateReviewStatus(supabase, context.reviewId, {
      deleted_at: new Date().toISOString(),
      deleted_by_id: context.userId,
    })

    if (!result.success) return result

    await recordAuditLog(supabase, {
      userId: context.userId,
      reviewId: context.reviewId,
      action: 'delete_review',
      eventType: 'review_deleted',
      severity: 'warning',
      metadata: { reason: context.reason || 'No reason provided' },
    })

    revalidateModerationPaths()
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete review' }
  }
}

/**
 * Approve review
 */
export async function approveReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: ModerationContext
): Promise<ModerationResult> {
  try {
    const result = await updateReviewStatus(supabase, context.reviewId, {
      moderation_status: 'approved',
      moderated_at: new Date().toISOString(),
      moderated_by_id: context.userId,
    })

    if (!result.success) return result

    await recordAuditLog(supabase, {
      userId: context.userId,
      reviewId: context.reviewId,
      action: 'approve_review',
      eventType: 'review_approved',
      severity: 'info',
    })

    revalidateModerationPaths()
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to approve review' }
  }
}

/**
 * Flag review
 */
export async function flagReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: ModerationContext
): Promise<ModerationResult> {
  try {
    const result = await updateReviewStatus(supabase, context.reviewId, {
      moderation_status: 'flagged',
      flagged_at: new Date().toISOString(),
      flagged_by_id: context.userId,
    })

    if (!result.success) return result

    await recordAuditLog(supabase, {
      userId: context.userId,
      reviewId: context.reviewId,
      action: 'flag_review',
      eventType: 'review_flagged',
      severity: 'warning',
      metadata: { reason: context.reason },
    })

    revalidateModerationPaths()
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to flag review' }
  }
}

/**
 * Unflag review
 */
export async function unflagReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: ModerationContext
): Promise<ModerationResult> {
  try {
    const result = await updateReviewStatus(supabase, context.reviewId, {
      moderation_status: 'approved',
      flagged_at: null,
      flagged_by_id: null,
    })

    if (!result.success) return result

    await recordAuditLog(supabase, {
      userId: context.userId,
      reviewId: context.reviewId,
      action: 'unflag_review',
      eventType: 'review_unflagged',
      severity: 'info',
    })

    revalidateModerationPaths()
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to unflag review' }
  }
}

/**
 * Hide review
 */
export async function hideReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: ModerationContext
): Promise<ModerationResult> {
  try {
    const result = await updateReviewStatus(supabase, context.reviewId, {
      is_hidden: true,
      hidden_at: new Date().toISOString(),
      hidden_by_id: context.userId,
    })

    if (!result.success) return result

    await recordAuditLog(supabase, {
      userId: context.userId,
      reviewId: context.reviewId,
      action: 'hide_review',
      eventType: 'review_hidden',
      severity: 'info',
      metadata: { reason: context.reason },
    })

    revalidateModerationPaths()
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to hide review' }
  }
}

/**
 * Feature review
 */
export async function featureReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  context: ModerationContext
): Promise<ModerationResult> {
  try {
    const result = await updateReviewStatus(supabase, context.reviewId, {
      is_featured: true,
      featured_at: new Date().toISOString(),
    })

    if (!result.success) return result

    await recordAuditLog(supabase, {
      userId: context.userId,
      reviewId: context.reviewId,
      action: 'feature_review',
      eventType: 'review_featured',
      severity: 'info',
    })

    revalidateModerationPaths()
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to feature review' }
  }
}
