import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'

/**
 * Verify that a review belongs to the specified salon
 */
export async function verifyReviewAccess(
  reviewId: string,
  salonId?: string,
): Promise<boolean> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.length) throw new Error('Unauthorized')

  const resolvedSalonId = salonId ?? accessibleSalonIds[0]!
  if (!accessibleSalonIds.includes(resolvedSalonId)) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: review } = await supabase
    .from('salon_reviews_view')
    .select('salon_id')
    .eq('id', reviewId)
    .eq('salon_id', resolvedSalonId)
    .single<{ salon_id: string }>()

  return !!review
}

/**
 * Verify that a review has a response
 */
export async function verifyReviewHasResponse(
  reviewId: string,
  salonId?: string,
): Promise<{ exists: boolean; response: string | null }> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.length) throw new Error('Unauthorized')

  const resolvedSalonId = salonId ?? accessibleSalonIds[0]!
  if (!accessibleSalonIds.includes(resolvedSalonId)) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: review } = await supabase
    .from('salon_reviews_view')
    .select('salon_id, response')
    .eq('id', reviewId)
    .eq('salon_id', resolvedSalonId)
    .single<{ salon_id: string; response: string | null }>()

  if (!review) {
    return { exists: false, response: null }
  }

  return { exists: true, response: review.response }
}
