import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type SalonReview = Database['public']['Views']['salon_reviews_view']['Row']

export type SalonReviewWithDetails = SalonReview

/**
 * Get all reviews for the user's salon
 */
export async function getSalonReviews(): Promise<SalonReviewWithDetails[]> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as SalonReviewWithDetails[]
}

/**
 * Get review statistics for the salon
 */
export async function getReviewStats(salonId: string): Promise<{
  totalReviews: number
  averageRating: number
  ratingDistribution: { rating: number; count: number }[]
  pendingResponses: number
  flaggedCount: number
}> {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('salon_reviews_view')
    .select('rating, response, is_flagged')
    .eq('salon_id', salonId)

  if (error) throw error

  type ReviewData = { rating: number | null; response: string | null; is_flagged: boolean | null }
  const reviewsTyped = (reviews || []) as ReviewData[]

  const totalReviews = reviewsTyped.length
  const averageRating = totalReviews > 0
    ? reviewsTyped.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviewsTyped.filter(r => r.rating === rating).length,
  }))

  const pendingResponses = reviewsTyped.filter(r => !r.response).length
  const flaggedCount = reviewsTyped.filter(r => r.is_flagged).length

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    pendingResponses,
    flaggedCount,
  }
}

/**
 * Get single review by ID
 */
export async function getReviewById(id: string): Promise<SalonReviewWithDetails | null> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as SalonReviewWithDetails
}
