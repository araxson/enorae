import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type SalonReviewView = Database['engagement']['Views']['salon_reviews_with_counts']['Row']

export type SalonReviewWithDetails = SalonReviewView & {
  customer_name?: string | null
  responded_by_name?: string | null
}

/**
 * Get all reviews for the user's salon
 */
export async function getSalonReviews(): Promise<SalonReviewWithDetails[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('engagement')
    .from('salon_reviews_with_counts')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Fetch customer and responder names separately
  const customerIds = [...new Set((data || []).map(r => r.customer_id).filter(Boolean))]
  const responderIds = [...new Set((data || []).map(r => r.responded_by_id).filter(Boolean))]

  const customerNames: Record<string, string> = {}
  const responderNames: Record<string, string> = {}

  if (customerIds.length > 0) {
    const { data: customers } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('profile_id, full_name')
      .in('profile_id', customerIds as string[])

    customers?.forEach(c => {
      if (c.profile_id && c.full_name) customerNames[c.profile_id] = c.full_name
    })
  }

  if (responderIds.length > 0) {
    const { data: responders } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('profile_id, full_name')
      .in('profile_id', responderIds as string[])

    responders?.forEach(r => {
      if (r.profile_id && r.full_name) responderNames[r.profile_id] = r.full_name
    })
  }

  return (data || []).map(review => ({
    ...review,
    customer_name: review.customer_id ? customerNames[review.customer_id] : null,
    responded_by_name: review.responded_by_id ? responderNames[review.responded_by_id] : null,
  }))
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
  // SECURITY: Enforce salon access for provided salonId
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .schema('engagement')
    .from('salon_reviews_with_counts')
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
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('engagement')
    .from('salon_reviews_with_counts')
    .select('*')
    .eq('id', id)
    .eq('salon_id', salonId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Fetch customer and responder names
  let customer_name: string | null = null
  let responded_by_name: string | null = null

  if (data.customer_id) {
    const { data: customer } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('full_name')
      .eq('profile_id', data.customer_id)
      .single()
    customer_name = customer?.full_name ?? null
  }

  if (data.responded_by_id) {
    const { data: responder } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('full_name')
      .eq('profile_id', data.responded_by_id)
      .single()
    responded_by_name = responder?.full_name ?? null
  }

  return {
    ...data,
    customer_name,
    responded_by_name,
  }
}