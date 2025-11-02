import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Blocked time type enumeration
 */
export const blockedTimeTypeEnum = z.enum(['break', 'lunch', 'meeting', 'training', 'personal', 'maintenance', 'other'])

/**
 * Recurrence pattern enumeration
 */
export const recurrencePatternEnum = z.enum(['none', 'daily', 'weekly', 'monthly'])

/**
 * Blocked time schema
 * For blocking off time when staff is unavailable
 */
export const blockedTimeSchema = z.object({
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  blocked_time_type: blockedTimeTypeEnum,
  start_time: z
    .string()
    .datetime('Invalid datetime format')
    .refine(
      (date) => {
        const startTime = new Date(date)
        const now = new Date()
        // Allow blocking time from yesterday onwards (timezone tolerance)
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        return startTime >= yesterday
      },
      {
        message: 'Start time cannot be more than 1 day in the past',
      }
    ),
  end_time: z.string().datetime('Invalid datetime format'),
  is_all_day: z.boolean().default(false),
  recurrence: recurrencePatternEnum.default('none'),
  recurrence_end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // End time must be after start time
    const start = new Date(data.start_time)
    const end = new Date(data.end_time)
    return end > start
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
).refine(
  (data) => {
    // Duration should be reasonable (max 24 hours for a single blocked time)
    const start = new Date(data.start_time)
    const end = new Date(data.end_time)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return durationHours <= 24
  },
  {
    message: 'Blocked time duration cannot exceed 24 hours',
    path: ['end_time'],
  }
).refine(
  (data) => {
    // If recurrence is not 'none', recurrence_end_date is required
    if (data.recurrence !== 'none' && !data.recurrence_end_date) {
      return false
    }
    return true
  },
  {
    message: 'Recurrence end date is required for recurring blocked times',
    path: ['recurrence_end_date'],
  }
).refine(
  (data) => {
    // Recurrence end date must be after start date
    if (data.recurrence !== 'none' && data.recurrence_end_date) {
      const start = new Date(data.start_time)
      const end = new Date(data.recurrence_end_date)
      start.setHours(0, 0, 0, 0)
      return end > start
    }
    return true
  },
  {
    message: 'Recurrence end date must be after start date',
    path: ['recurrence_end_date'],
  }
)

/**
 * Bulk blocked time schema
 * For blocking the same time for multiple staff members
 */
export const bulkBlockedTimeSchema = z.object({
  staff_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid staff ID'))
    .min(1, 'Select at least one staff member')
    .max(50, 'Cannot block time for more than 50 staff members at once'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  blocked_time_type: blockedTimeTypeEnum,
  start_time: z.string().datetime('Invalid datetime format'),
  end_time: z.string().datetime('Invalid datetime format'),
  is_all_day: z.boolean().default(false),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type BlockedTimeSchema = z.infer<typeof blockedTimeSchema>
export type BulkBlockedTimeSchema = z.infer<typeof bulkBlockedTimeSchema>
