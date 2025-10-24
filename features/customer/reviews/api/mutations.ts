'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { ZodError } from 'zod'
import { reviewSchema } from '@/lib/validations/customer/reviews'

type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

export async function createReview(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const data = {
      salonId: formData.get('salonId') as string,
      appointmentId: formData.get('appointmentId') as string | undefined,
      rating: parseInt(formData.get('rating') as string),
      title: formData.get('title') as string | undefined,
      comment: formData.get('comment') as string,
      serviceQualityRating: formData.get('serviceQualityRating') ? parseInt(formData.get('serviceQualityRating') as string) : undefined,
      cleanlinessRating: formData.get('cleanlinessRating') ? parseInt(formData.get('cleanlinessRating') as string) : undefined,
      valueRating: formData.get('valueRating') ? parseInt(formData.get('valueRating') as string) : undefined,
    }

    const validated = reviewSchema.parse(data)

    // Note: .schema() required for INSERT/UPDATE/DELETE on tables (not views)
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .insert({
        salon_id: validated.salonId,
        customer_id: session.user.id,
        appointment_id: validated.appointmentId,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        service_quality_rating: validated.serviceQualityRating,
        cleanliness_rating: validated.cleanlinessRating,
        value_rating: validated.valueRating,
      })

    if (error) throw error

    revalidatePath('/customer/reviews')
    revalidatePath(`/customer/salons/${validated.salonId}`)

    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: error instanceof Error ? error.message : 'Failed to create review' }
  }
}

export async function updateReview(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Verify ownership and check edit window
    type ReviewRow = { customer_id: string; created_at: string; salon_id: string }

    const { data: review, error: fetchError } = await supabase
      .from('salon_reviews')
      .select('customer_id, created_at, salon_id')
      .eq('id', id)
      .eq('customer_id', session.user.id)
      .returns<ReviewRow[]>()
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return { error: 'Review not found or not authorized' }
      }
      throw fetchError
    }

    if (!review) {
      return { error: 'Review not found or not authorized' }
    }

    // Check 7-day edit window
    const daysSince = (Date.now() - new Date(review.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 7) {
      return { error: 'Reviews can only be edited within 7 days of creation' }
    }

    const data = {
      salonId: formData.get('salonId') as string,
      appointmentId: formData.get('appointmentId') as string | undefined,
      rating: parseInt(formData.get('rating') as string),
      title: formData.get('title') as string | undefined,
      comment: formData.get('comment') as string,
      serviceQualityRating: formData.get('serviceQualityRating') ? parseInt(formData.get('serviceQualityRating') as string) : undefined,
      cleanlinessRating: formData.get('cleanlinessRating') ? parseInt(formData.get('cleanlinessRating') as string) : undefined,
      valueRating: formData.get('valueRating') ? parseInt(formData.get('valueRating') as string) : undefined,
    }

    const validated = reviewSchema.parse(data)

    // Note: .schema() required for INSERT/UPDATE/DELETE
    const { error } = await supabase
      .schema('engagement')
      .from('salon_reviews')
      .update({
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        service_quality_rating: validated.serviceQualityRating,
        cleanliness_rating: validated.cleanlinessRating,
        value_rating: validated.valueRating,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('customer_id', session.user.id)

    if (error) throw error

    revalidatePath('/customer/reviews')
    revalidatePath(`/customer/salons/${review.salon_id}`)

    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: error instanceof Error ? error.message : 'Failed to update review' }
  }
}

export async function deleteReview(id: string, salonId: string): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Verify ownership before deleting
    type ReviewRow = { customer_id: string }

    const { data: review, error: fetchError } = await supabase
      .from('salon_reviews')
      .select('customer_id')
      .eq('id', id)
      .returns<ReviewRow[]>()
      .single()

    if (fetchError) throw fetchError

    if (!review) {
      return { error: 'Review not found' }
    }

    if (review.customer_id !== session.user.id) {
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

    if (error) throw error

    revalidatePath('/customer/reviews')
    revalidatePath(`/customer/salons/${salonId}`)

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete review' }
  }
}
