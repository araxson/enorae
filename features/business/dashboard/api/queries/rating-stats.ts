import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface RatingStats {
  average_rating: number
  review_count: number
  rating_distribution: Record<string, number>
}

type RatingStatsRpc = {
  average_rating: number | null
  review_count: number | null
  rating_distribution: Record<string, number> | null
}

export async function getSalonRatingStats(salonId: string): Promise<RatingStats | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.rpc('get_salon_rating_stats', { p_salon_id: salonId })

  if (error) throw error

  const statsArray = (data as RatingStatsRpc[] | null) ?? null
  const stats = statsArray?.[0]
  if (!stats) return null

  const ratingDistribution =
    stats.rating_distribution && typeof stats.rating_distribution === 'object'
      ? (stats.rating_distribution as Record<string, number>)
      : {}

  return {
    average_rating: stats.average_rating ?? 0,
    review_count: stats.review_count ?? 0,
    rating_distribution: ratingDistribution,
  }
}
