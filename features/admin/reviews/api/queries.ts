import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AdminReview = Database['public']['Views']['admin_reviews_overview']['Row']

/**
 * Get all reviews overview
 * SECURITY: Platform admin only
 */
export async function getAllReviews(limit = 100): Promise<AdminReview[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_reviews_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('admin_reviews_overview error:', error)
    return []
  }

  return data || []
}