import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Operating hours for a single day schema
 * Validates open/close times for a salon on a specific day
 */
export const operatingHoursSchema = z.object({
  day_of_week: z.coerce
    .number()
    .int('Day must be a whole number')
    .min(0, 'Sunday is 0')
    .max(6, 'Saturday is 6'),
  is_open: z.boolean().default(true),
  open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format (e.g., 09:00)'),
  close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format (e.g., 18:00)'),
  notes: z.string().max(200, 'Notes must be 200 characters or fewer').optional(),
}).refine(
  (data) => {
    // If salon is open, close time must be after open time
    if (data.is_open) {
      const [openHour = 0, openMin = 0] = data.open_time.split(':').map(Number)
      const [closeHour = 0, closeMin = 0] = data.close_time.split(':').map(Number)
      const openMinutes = openHour * 60 + openMin
      const closeMinutes = closeHour * 60 + closeMin
      return closeMinutes > openMinutes
    }
    return true
  },
  {
    message: 'Close time must be after open time',
    path: ['close_time'],
  }
).refine(
  (data) => {
    // Operating hours should be reasonable (at least 1 hour, max 24 hours)
    if (data.is_open) {
      const [openHour = 0, openMin = 0] = data.open_time.split(':').map(Number)
      const [closeHour = 0, closeMin = 0] = data.close_time.split(':').map(Number)
      const openMinutes = openHour * 60 + openMin
      const closeMinutes = closeHour * 60 + closeMin
      const duration = closeMinutes - openMinutes
      return duration >= 60 && duration <= 1440 // 1 to 24 hours
    }
    return true
  },
  {
    message: 'Operating hours must be between 1 and 24 hours',
    path: ['close_time'],
  }
)

/**
 * Weekly operating hours schema
 * For bulk updating a full week of hours
 */
export const weeklyOperatingHoursSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  hours: z
    .array(
      z.object({
        day_of_week: z.coerce.number().int().min(0).max(6),
        is_open: z.boolean(),
        open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        notes: z.string().max(200).optional(),
      })
    )
    .length(7, 'Must provide hours for all 7 days of the week'),
})

/**
 * Holiday hours override schema
 * For setting special hours on holidays or special occasions
 */
export const holidayHoursSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  holiday_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const holidayDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return holidayDate >= today
      },
      {
        message: 'Holiday date cannot be in the past',
      }
    ),
  holiday_name: z.string().min(2, 'Holiday name is required').max(100, 'Holiday name is too long'),
  is_open: z.boolean().default(false),
  open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format').optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // If open, times must be provided
    if (data.is_open && (!data.open_time || !data.close_time)) {
      return false
    }
    return true
  },
  {
    message: 'Open and close times are required when salon is open',
    path: ['open_time'],
  }
).refine(
  (data) => {
    // If open, close must be after open
    if (data.is_open && data.open_time && data.close_time) {
      const [openHour = 0, openMin = 0] = data.open_time.split(':').map(Number)
      const [closeHour = 0, closeMin = 0] = data.close_time.split(':').map(Number)
      const openMinutes = openHour * 60 + openMin
      const closeMinutes = closeHour * 60 + closeMin
      return closeMinutes > openMinutes
    }
    return true
  },
  {
    message: 'Close time must be after open time',
    path: ['close_time'],
  }
)

/**
 * Temporary closure schema
 * For scheduling temporary closures (renovations, vacations, etc.)
 */
export const temporaryClosureSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const startDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return startDate >= today
      },
      {
        message: 'Start date cannot be in the past',
      }
    ),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)').max(500, 'Reason is too long'),
  display_message: z
    .string()
    .min(10, 'Public message must be at least 10 characters')
    .max(200, 'Message must be 200 characters or fewer')
    .optional(),
}).refine(
  (data) => {
    // End date must be after start date
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    return end > start
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
).refine(
  (data) => {
    // Closure duration should be reasonable (max 1 year)
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 365
  },
  {
    message: 'Closure cannot exceed 1 year',
    path: ['end_date'],
  }
)

/**
 * Inferred TypeScript types from schemas
 */
export type OperatingHoursSchema = z.infer<typeof operatingHoursSchema>
export type WeeklyOperatingHoursSchema = z.infer<typeof weeklyOperatingHoursSchema>
export type HolidayHoursSchema = z.infer<typeof holidayHoursSchema>
export type TemporaryClosureSchema = z.infer<typeof temporaryClosureSchema>
