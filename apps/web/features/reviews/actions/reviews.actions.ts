'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

const createReviewSchema = z.object({
  salonId: z.string(),
  appointmentId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  serviceRating: z.number().min(1).max(5),
  staffRating: z.number().min(1).max(5),
  ambienceRating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5),
})

export async function createReview(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const parsed = createReviewSchema.parse({
    salonId: formData.get('salonId'),
    appointmentId: formData.get('appointmentId'),
    rating: Number(formData.get('rating')),
    comment: formData.get('comment'),
    serviceRating: Number(formData.get('serviceRating')),
    staffRating: Number(formData.get('staffRating')),
    ambienceRating: Number(formData.get('ambienceRating')),
    cleanlinessRating: Number(formData.get('cleanlinessRating')),
  })

  const { error } = await (supabase as any)
    .from('reviews')
    .insert({
      customer_id: user.id,
      salon_id: parsed.salonId,
      appointment_id: parsed.appointmentId,
      rating: parsed.rating,
      comment: parsed.comment,
      service_rating: parsed.serviceRating,
      staff_rating: parsed.staffRating,
      ambience_rating: parsed.ambienceRating,
      cleanliness_rating: parsed.cleanlinessRating,
    })

  if (error) throw error
  revalidatePath(`/salons/${parsed.salonId}`)
  revalidatePath('/profile/reviews')
}

export async function updateReview(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const reviewId = formData.get('reviewId') as string
  const rating = Number(formData.get('rating'))
  const comment = formData.get('comment') as string

  const { error } = await (supabase as any)
    .from('reviews')
    .update({ rating, comment, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .eq('customer_id', user.id)

  if (error) throw error
  revalidatePath('/profile/reviews')
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('customer_id', user.id)

  if (error) throw error
  revalidatePath('/profile/reviews')
}