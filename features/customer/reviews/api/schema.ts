import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Review creation/update schema
 * Validates all review details including ratings and comment
 */
export const reviewSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  appointmentId: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
  rating: z.coerce
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  title: z
    .string()
    .max(200, 'Title must be 200 characters or fewer')
    .optional(),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters to be helpful')
    .max(2000, 'Review must be 2000 characters or fewer'),
  serviceQualityRating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars')
    .optional(),
  cleanlinessRating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars')
    .optional(),
  valueRating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars')
    .optional(),
})

/**
 * Review deletion schema
 */
export const deleteReviewSchema = z.object({
  reviewId: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
})

/**
 * Inferred TypeScript types from schemas
 */
export type ReviewSchema = z.output<typeof reviewSchema>
export type ReviewSchemaInput = z.input<typeof reviewSchema>
export type DeleteReviewSchema = z.infer<typeof deleteReviewSchema>
