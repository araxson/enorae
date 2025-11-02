import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Schedule type enumeration
 */
export const scheduleTypeEnum = z.enum(['regular', 'override', 'time_off', 'exception'])


/**
 * Staff schedule schema
 * Validates staff working hours and availability
 */
export const staffScheduleSchema = z.object({
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  day_of_week: z.coerce
    .number()
    .int('Day must be a whole number')
    .min(0, 'Sunday is 0')
    .max(6, 'Saturday is 6'),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format (e.g., 09:00)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format (e.g., 17:00)'),
  is_available: z.boolean().default(true),
  schedule_type: scheduleTypeEnum.default('regular'),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // End time must be after start time
    const startParts = data.start_time.split(':').map(Number)
    const endParts = data.end_time.split(':').map(Number)
    const startHour = startParts[0] ?? 0
    const startMin = startParts[1] ?? 0
    const endHour = endParts[0] ?? 0
    const endMin = endParts[1] ?? 0
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return endMinutes > startMinutes
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
).refine(
  (data) => {
    // Working hours should be reasonable (at least 1 hour, max 16 hours)
    const startParts = data.start_time.split(':').map(Number)
    const endParts = data.end_time.split(':').map(Number)
    const startHour = startParts[0] ?? 0
    const startMin = startParts[1] ?? 0
    const endHour = endParts[0] ?? 0
    const endMin = endParts[1] ?? 0
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const duration = endMinutes - startMinutes
    return duration >= 60 && duration <= 960 // 1 hour to 16 hours
  },
  {
    message: 'Shift duration must be between 1 and 16 hours',
    path: ['end_time'],
  }
)

/**
 * Schedule override schema
 * For temporary changes to regular schedules (e.g., vacation, sick day)
 */
export const scheduleOverrideSchema = z.object({
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  override_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const overrideDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // Allow overrides from yesterday onwards (in case of timezone issues)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return overrideDate >= yesterday
      },
      {
        message: 'Override date cannot be in the past',
      }
    ),
  is_available: z.boolean(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  reason: z.string().min(3, 'Please provide a reason').max(500, 'Reason must be 500 characters or fewer'),
}).refine(
  (data) => {
    // If available, start and end times are required
    if (data.is_available && (!data.start_time || !data.end_time)) {
      return false
    }
    return true
  },
  {
    message: 'Start and end times are required when staff is available',
    path: ['start_time'],
  }
).refine(
  (data) => {
    // If times are provided, end must be after start
    if (data.start_time && data.end_time) {
      const startParts = data.start_time.split(':').map(Number)
      const endParts = data.end_time.split(':').map(Number)
      const startHour = startParts[0] ?? 0
      const startMin = startParts[1] ?? 0
      const endHour = endParts[0] ?? 0
      const endMin = endParts[1] ?? 0
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return endMinutes > startMinutes
    }
    return true
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
)

/**
 * Weekly schedule schema
 * For bulk updating a full week of schedules
 */
export const weeklyScheduleSchema = z.object({
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  schedules: z
    .array(
      z.object({
        day_of_week: z.coerce.number().int().min(0).max(6),
        start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        is_available: z.boolean(),
      })
    )
    .length(7, 'Must provide schedules for all 7 days of the week'),
})

/**
 * Break time schema
 * For scheduling breaks during shifts
 */
export const breakTimeSchema = z.object({
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  day_of_week: z.coerce.number().int().min(0, 'Sunday is 0').max(6, 'Saturday is 6').optional(),
  break_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  break_type: z.enum(['lunch', 'short_break', 'other']),
  is_paid: z.boolean().default(true),
}).refine(
  (data) => {
    // Must have either day_of_week (recurring) or break_date (one-time)
    return data.day_of_week !== undefined || data.break_date !== undefined
  },
  {
    message: 'Must specify either day of week (recurring) or specific date (one-time)',
    path: ['day_of_week'],
  }
).refine(
  (data) => {
    // End time must be after start time
    const startParts = data.start_time.split(':').map(Number)
    const endParts = data.end_time.split(':').map(Number)
    const startHour = startParts[0] ?? 0
    const startMin = startParts[1] ?? 0
    const endHour = endParts[0] ?? 0
    const endMin = endParts[1] ?? 0
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return endMinutes > startMinutes
  },
  {
    message: 'Break end time must be after start time',
    path: ['end_time'],
  }
).refine(
  (data) => {
    // Break duration should be reasonable (5 minutes to 2 hours)
    const startParts = data.start_time.split(':').map(Number)
    const endParts = data.end_time.split(':').map(Number)
    const startHour = startParts[0] ?? 0
    const startMin = startParts[1] ?? 0
    const endHour = endParts[0] ?? 0
    const endMin = endParts[1] ?? 0
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const duration = endMinutes - startMinutes
    return duration >= 5 && duration <= 120
  },
  {
    message: 'Break duration must be between 5 minutes and 2 hours',
    path: ['end_time'],
  }
)

/**
 * Inferred TypeScript types from schemas
 */
export type StaffScheduleSchema = z.infer<typeof staffScheduleSchema>
export type ScheduleOverrideSchema = z.infer<typeof scheduleOverrideSchema>
export type WeeklyScheduleSchema = z.infer<typeof weeklyScheduleSchema>
export type BreakTimeSchema = z.infer<typeof breakTimeSchema>
