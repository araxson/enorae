'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { ZodError } from 'zod'
import { reviewSchema } from '@/features/customer/reviews/api/validation'
import type { Database } from '@/lib/types/database.types'
import { MILLISECONDS_PER_DAY, REVIEW_EDIT_WINDOW_DAYS } from '@/lib/constants/time'
import { createOperationLogger } from '@/lib/observability'
import { getRequiredString, getOptionalString, getRequiredInt, getOptionalInt } from '@/lib/utils/safe-form-data'
import { sanitizeReviewComment, sanitizeText, isSpamContent } from '@/lib/utils/sanitize'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

export async function createReview(formData: FormData): Promise<ActionResult> {
  const logger = createOperationLogger('createReview', {})

  try {
    // Parallel execution: fetch auth, client IP, and create supabase client
    const [session, clientIp] = await Promise.all([
      requireAuth(),
      getClientIdentifier()
    ])

    // Rate limiting: 3 reviews per user per day
    const rateLimitKey = createRateLimitKey('review', `${session.user.id}:${clientIp}`)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 3,
      windowMs: 86400000, // 24 hours
    })

    if (!rateLimitResult.success) {
      logger.warn('Review rate limit exceeded', { userId: session.user.id, remaining: rateLimitResult.remaining ?? 0 })
      return { error: rateLimitResult.error ?? 'Too many reviews submitted. Please try again later.' }
    }

    const supabase = await createClient()

    const data = {
      salonId: getRequiredString(formData, 'salonId'),
      appointmentId: getOptionalString(formData, 'appointmentId') ?? undefined,
      rating: getRequiredInt(formData, 'rating'),
      title: getOptionalString(formData, 'title') ?? undefined,
      comment: getRequiredString(formData, 'comment'),
      serviceQualityRating: getOptionalInt(formData, 'serviceQualityRating') ?? undefined,
      cleanlinessRating: getOptionalInt(formData, 'cleanlinessRating') ?? undefined,
      valueRating: getOptionalInt(formData, 'valueRating') ?? undefined,
    }

    logger.start({ salonId: data.salonId, userId: session.user.id, rating: data.rating })

    const result = reviewSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed' }
    }

    const validated = result.data

    // SECURITY: Sanitize comment and title to prevent XSS
    const sanitizedComment = sanitizeReviewComment(validated.comment)
    const sanitizedTitle = validated.title ? sanitizeText(validated.title) : undefined

    // SECURITY: Check for spam content
    if (isSpamContent(sanitizedComment)) {
      logger.warn('Spam content detected', { userId: session.user.id })
      return { error: 'Review appears to contain spam or promotional content' }
    }

    // Note: .schema() required for INSERT/UPDATE/DELETE on tables (not views)
    const { data: review, error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .insert({
        salon_id: validated.salonId,
        customer_id: session.user.id,
        appointment_id: validated.appointmentId,
        rating: validated.rating,
        title: sanitizedTitle,
        comment: sanitizedComment,
        service_quality_rating: validated.serviceQualityRating,
        cleanliness_rating: validated.cleanlinessRating,
        value_rating: validated.valueRating,
      })
      .select('id')
      .single()

    if (error) {
      logger.error(error, 'database', { salonId: validated.salonId, userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/reviews', 'page')
    revalidatePath(`/customer/salons/${validated.salonId}`, 'page')

    logger.success({ salonId: validated.salonId, userId: session.user.id, reviewId: review.id })
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      logger.error(error.issues?.[0]?.message ?? 'Validation failed', 'validation')
      return { error: error.issues?.[0]?.message ?? 'Validation failed' }
    }
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Failed to create review' }
  }
}

export async function updateReview(id: string, formData: FormData): Promise<ActionResult> {
  const logger = createOperationLogger('updateReview', { reviewId: id })

  try {
    // Parallel execution: fetch session and supabase client simultaneously
    const [session, supabase] = await Promise.all([
      requireAuth(),
      createClient()
    ])

    logger.start({ reviewId: id, userId: session.user.id })

    const { data: review, error: fetchError } = await supabase
      .from('salon_reviews_view')
      .select('customer_id, created_at, salon_id')
      .eq('id', id)
      .eq('customer_id', session.user.id)
      .maybeSingle<
        Pick<
          Database['public']['Views']['salon_reviews_view']['Row'],
          'customer_id' | 'created_at' | 'salon_id'
        >
      >()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        logger.error('Review not found', 'not_found', { reviewId: id, userId: session.user.id })
        return { error: 'Review not found or not authorized' }
      }
      logger.error(fetchError, 'database', { reviewId: id, userId: session.user.id })
      throw fetchError
    }

    if (!review) {
      logger.error('Review not found or unauthorized', 'not_found', { reviewId: id, userId: session.user.id })
      return { error: 'Review not found or not authorized' }
    }

    // Check review edit window
    if (!review.created_at) {
      logger.error('Review creation date missing', 'validation', { reviewId: id, userId: session.user.id })
      return { error: 'Review creation date missing' }
    }
    const daysSince = (Date.now() - new Date(review.created_at).getTime()) / MILLISECONDS_PER_DAY
    if (daysSince > REVIEW_EDIT_WINDOW_DAYS) {
      logger.warn('Review edit window expired', { reviewId: id, userId: session.user.id, daysSince })
      return { error: `Reviews can only be edited within ${REVIEW_EDIT_WINDOW_DAYS} days of creation` }
    }

    const updateData = {
      salonId: getRequiredString(formData, 'salonId'),
      appointmentId: getOptionalString(formData, 'appointmentId') ?? undefined,
      rating: getRequiredInt(formData, 'rating'),
      title: getOptionalString(formData, 'title') ?? undefined,
      comment: getRequiredString(formData, 'comment'),
      serviceQualityRating: getOptionalInt(formData, 'serviceQualityRating') ?? undefined,
      cleanlinessRating: getOptionalInt(formData, 'cleanlinessRating') ?? undefined,
      valueRating: getOptionalInt(formData, 'valueRating') ?? undefined,
    }

    const result = reviewSchema.safeParse(updateData)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed' }
    }

    const validated = result.data

    // SECURITY: Sanitize comment and title to prevent XSS
    const sanitizedComment = sanitizeReviewComment(validated.comment)
    const sanitizedTitle = validated.title ? sanitizeText(validated.title) : undefined

    // SECURITY: Check for spam content
    if (isSpamContent(sanitizedComment)) {
      logger.warn('Spam content detected in update', { reviewId: id, userId: session.user.id })
      return { error: 'Review appears to contain spam or promotional content' }
    }

    // Note: .schema() required for INSERT/UPDATE/DELETE
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        rating: validated.rating,
        title: sanitizedTitle,
        comment: sanitizedComment,
        service_quality_rating: validated.serviceQualityRating,
        cleanliness_rating: validated.cleanlinessRating,
        value_rating: validated.valueRating,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('customer_id', session.user.id)

    if (error) {
      logger.error(error, 'database', { reviewId: id, salonId: review.salon_id ?? undefined, userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/reviews', 'page')
    if (review.salon_id) {
      revalidatePath(`/customer/salons/${review.salon_id}`, 'page')
    }

    logger.success({ reviewId: id, salonId: review.salon_id, userId: session.user.id })
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      logger.error(error.issues?.[0]?.message ?? 'Validation failed', 'validation', { reviewId: id })
      return { error: error.issues?.[0]?.message ?? 'Validation failed' }
    }
    logger.error(error instanceof Error ? error : String(error), 'system', { reviewId: id })
    return { error: error instanceof Error ? error.message : 'Failed to update review' }
  }
}

export async function deleteReview(id: string, salonId: string): Promise<ActionResult> {
  const logger = createOperationLogger('deleteReview', { reviewId: id, salonId })

  try {
    // Parallel execution: fetch session and supabase client simultaneously
    const [session, supabase] = await Promise.all([
      requireAuth(),
      createClient()
    ])

    logger.start({ reviewId: id, salonId, userId: session.user.id })

    // Verify ownership before deleting
    const { data: review, error: fetchError } = await supabase
      .from('salon_reviews_view')
      .select('customer_id')
      .eq('id', id)
      .eq('customer_id', session.user.id)
      .maybeSingle<Pick<Database['public']['Views']['salon_reviews_view']['Row'], 'customer_id'>>()

    if (fetchError) {
      logger.error(fetchError, 'database', { reviewId: id, salonId, userId: session.user.id })
      throw fetchError
    }

    if (!review) {
      logger.error('Review not found', 'not_found', { reviewId: id, salonId, userId: session.user.id })
      return { error: 'Review not found' }
    }

    if (review.customer_id !== session.user.id) {
      logger.error('Unauthorized deletion attempt', 'permission', { reviewId: id, salonId, userId: session.user.id, reviewOwnerId: review.customer_id })
      return { error: 'Not authorized to delete this review' }
    }

    // Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('customer_id', session.user.id)

    if (error) {
      logger.error(error, 'database', { reviewId: id, salonId, userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/reviews', 'page')
    revalidatePath(`/customer/salons/${salonId}`, 'page')

    logger.success({ reviewId: id, salonId, userId: session.user.id })
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system', { reviewId: id, salonId })
    return { error: error instanceof Error ? error.message : 'Failed to delete review' }
  }
}
