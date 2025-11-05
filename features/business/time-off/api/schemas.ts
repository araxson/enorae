import { z } from 'zod'

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Time-off request type enum
export const timeOffTypeSchema = z.enum(['vacation', 'sick_leave', 'personal', 'bereavement', 'other'], {
  message: 'Invalid time-off type',
})

// Approve time-off request schema
export const approveTimeOffSchema = z.object({
  requestId: z.string().regex(UUID_REGEX, { error: 'Invalid request ID' }),
  approvalNotes: z.string().max(1000, { error: 'Notes must be less than 1000 characters' }).optional(),
})

// Reject time-off request schema
export const rejectTimeOffSchema = z.object({
  requestId: z.string().regex(UUID_REGEX, { error: 'Invalid request ID' }),
  rejectionReason: z
    .string()
    .min(10, { error: 'Please provide a detailed reason for rejection (at least 10 characters)' })
    .max(1000, { error: 'Reason must be less than 1000 characters' }),
})

// Create time-off request schema (for staff portal)
export const createTimeOffRequestSchema = z
  .object({
    salon_id: z.string().regex(UUID_REGEX, { error: 'Invalid salon ID' }),
    staff_id: z.string().regex(UUID_REGEX, { error: 'Invalid staff ID' }),
    request_type: timeOffTypeSchema,
    start_at: z.string().datetime({ error: 'Invalid start date format' }),
    end_at: z.string().datetime({ error: 'Invalid end date format' }),
    reason: z
      .string()
      .min(10, { error: 'Please provide a detailed reason (at least 10 characters)' })
      .max(1000, { error: 'Reason must be less than 1000 characters' }),
    notes: z.string().max(1000, { error: 'Notes must be less than 1000 characters' }).optional(),
  })
  .refine(
    (data) => new Date(data.end_at) > new Date(data.start_at),
    {
      message: 'End date must be after start date',
      path: ['end_at'],
    }
  )
  .refine(
    (data) => {
      // Start date should be in the future or today
      const startDate = new Date(data.start_at)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return startDate >= today
    },
    {
      message: 'Start date cannot be in the past',
      path: ['start_at'],
    }
  )
  .refine(
    (data) => {
      // Duration validation: max 90 days
      const start = new Date(data.start_at)
      const end = new Date(data.end_at)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 90
    },
    {
      message: 'Time-off duration cannot exceed 90 days',
      path: ['end_at'],
    }
  )

// Cancel time-off request schema
export const cancelTimeOffRequestSchema = z.object({
  requestId: z.string().regex(UUID_REGEX, { error: 'Invalid request ID' }),
  cancellationReason: z
    .string()
    .min(10, { error: 'Please provide a reason for cancellation (at least 10 characters)' })
    .max(500, { error: 'Reason must be less than 500 characters' }),
})

export type ApproveTimeOffInput = z.infer<typeof approveTimeOffSchema>
export type RejectTimeOffInput = z.infer<typeof rejectTimeOffSchema>
export type CreateTimeOffRequestInput = z.infer<typeof createTimeOffRequestSchema>
export type CancelTimeOffRequestInput = z.infer<typeof cancelTimeOffRequestSchema>
