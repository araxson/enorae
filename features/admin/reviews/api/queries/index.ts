import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { QUERY_LIMITS } from '@/lib/config/constants'

type AdminReview = Database['public']['Views']['admin_reviews_overview_view']['Row']

/**
 * Get all reviews overview
 * SECURITY: Platform admin only
 */
export async function getAllReviews(limit = QUERY_LIMITS.MEDIUM_LIST): Promise<AdminReview[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_reviews_overview_view')
    .select('id, salon_id, salon_name, customer_id, customer_name, rating, comment, status, is_flagged, flag_reason, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('admin_reviews_overview error:', error)
    return []
  }

  return (data || []) as unknown as Database['public']['Views']['admin_reviews_overview_view']['Row'][]
}