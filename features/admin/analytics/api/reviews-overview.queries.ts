import { requireAdminClient } from './admin-analytics-shared'
import type { AdminReviewRow } from './admin-analytics-types'

const REVIEWS_TABLE = 'admin_reviews_overview'

export async function getAllReviews(limit = 100): Promise<AdminReviewRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
