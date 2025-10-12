import { z } from 'zod'

export const reviewSchema = z.object({
  salonId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200).optional(),
  comment: z.string().min(10).max(2000),
  serviceQualityRating: z.number().int().min(1).max(5).optional(),
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  valueRating: z.number().int().min(1).max(5).optional(),
})
