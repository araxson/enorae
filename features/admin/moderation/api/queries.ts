import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ReviewModeration = Database['public']['Views']['admin_reviews_overview']['Row']
type MessageThread = Database['public']['Views']['admin_messages_overview']['Row']

export interface ModerationFilters {
  is_flagged?: boolean
  salon_id?: string
  date_from?: string
  date_to?: string
}

/**
 * Get reviews for moderation
 * SECURITY: Platform admin only
 */
export async function getReviewsForModeration(
  filters?: ModerationFilters
): Promise<ReviewModeration[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  let query = supabase
    .from('admin_reviews_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.is_flagged !== undefined) {
    query = query.eq('is_flagged', filters.is_flagged)
  }

  if (filters?.salon_id) {
    query = query.eq('salon_id', filters.salon_id)
  }

  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from)
  }

  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to)
  }

  const { data, error } = await query.limit(200)

  if (error) throw error
  return data || []
}

/**
 * Get flagged reviews
 * SECURITY: Platform admin only
 */
export async function getFlaggedReviews(): Promise<ReviewModeration[]> {
  return getReviewsForModeration({ is_flagged: true })
}

/**
 * Get message threads for monitoring
 * SECURITY: Platform admin only
 */
export async function getMessageThreadsForMonitoring(): Promise<MessageThread[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_messages_overview')
    .select('*')
    .order('last_message_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return data || []
}

/**
 * Get moderation statistics
 * SECURITY: Platform admin only
 */
export async function getModerationStats() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const [
    { count: totalReviews },
    { count: flaggedReviews },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('is_flagged', true)
      .is('deleted_at', null),
    supabase
      .from('salon_reviews')
      .select('*', { count: 'exact', head: true })
      .is('response', null)
      .is('deleted_at', null),
  ])

  return {
    totalReviews: totalReviews || 0,
    flaggedReviews: flaggedReviews || 0,
    pendingReviews: pendingReviews || 0,
  }
}
