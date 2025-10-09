import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface RatingStats {
  average_rating: number
  review_count: number
  rating_distribution: Record<string, number>
}

export async function getSalonRatingStats(salonId: string): Promise<RatingStats | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_salon_rating_stats', { p_salon_id: salonId })
    .single()

  if (error) throw error
  return data
}
