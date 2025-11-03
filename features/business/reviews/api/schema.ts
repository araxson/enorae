import { z } from 'zod'

/**
 * Schema for review response validation
 * Protects against XSS and database bloat
 */
export const reviewResponseSchema = z.object({
  response: z
    .string()
    .min(1, 'Response cannot be empty')
    .max(2000, 'Response cannot exceed 2000 characters')
    .trim(),
})

/**
 * Schema for flagging a review
 * Ensures reason is provided and within limits
 */
export const flagReviewSchema = z.object({
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters')
    .trim(),
})

/**
 * Schema for toggling featured status
 */
export const toggleFeaturedSchema = z.object({
  featured: z.boolean(),
})

export type ReviewResponseInput = z.infer<typeof reviewResponseSchema>
export type FlagReviewInput = z.infer<typeof flagReviewSchema>
export type ToggleFeaturedInput = z.infer<typeof toggleFeaturedSchema>
