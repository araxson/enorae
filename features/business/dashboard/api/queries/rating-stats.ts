import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability'

interface RatingStats {
  average_rating: number
  review_count: number
  rating_distribution: Record<string, number>
}

export async function getSalonRatingStats(salonId: string): Promise<RatingStats | null> {
  const logger = createOperationLogger('getSalonRatingStats', {})
  logger.start()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('rating')
    .eq('salon_id', salonId)

  if (error) throw error
  const ratings = (data ?? []) as Array<{ rating: number | null }>
  if (ratings.length === 0) {
    return {
      average_rating: 0,
      review_count: 0,
      rating_distribution: {},
    }
  }

  const buckets: Record<string, number> = {}
  let total = 0
  let count = 0

  ratings.forEach(({ rating }) => {
    if (rating == null) return
    const bucket = String(Math.round(rating))
    buckets[bucket] = (buckets[bucket] || 0) + 1
    total += rating
    count += 1
  })

  if (count === 0) {
    return {
      average_rating: 0,
      review_count: 0,
      rating_distribution: {},
    }
  }

  return {
    average_rating: Number((total / count).toFixed(2)),
    review_count: count,
    rating_distribution: buckets,
  }
}
