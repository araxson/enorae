import { z } from 'zod'

/**
 * Schema for time-off request ID validation
 * Enforces valid UUID format
 */
export const requestIdSchema = z.string().uuid('Invalid request ID format')

/**
 * Schema for review notes
 * Optional but must be valid string if provided, max 500 characters
 */
export const reviewNotesSchema = z
  .string()
  .max(500, 'Review notes must not exceed 500 characters')
  .optional()

/**
 * Schema for approving a time-off request
 */
export const approveTimeOffRequestSchema = z.object({
  requestId: requestIdSchema,
  notes: reviewNotesSchema,
})

/**
 * Schema for rejecting a time-off request
 * Notes are required when rejecting
 */
export const rejectTimeOffRequestSchema = z.object({
  requestId: requestIdSchema,
  notes: z
    .string()
    .min(1, 'Rejection reason is required')
    .max(500, 'Rejection reason must not exceed 500 characters'),
})

/**
 * Type exports for mutations
 */
export type ApproveTimeOffRequestInput = z.infer<typeof approveTimeOffRequestSchema>
export type RejectTimeOffRequestInput = z.infer<typeof rejectTimeOffRequestSchema>
