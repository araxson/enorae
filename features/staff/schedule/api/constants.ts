import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const SCHEDULE_UUID_REGEX = UUID_REGEX
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export const scheduleSchema = z.object({
  staff_id: z.string().uuid('Invalid staff ID'),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  start_time: z.string().regex(TIME_REGEX, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(TIME_REGEX, 'Invalid time format (HH:MM)'),
  is_recurring: z.boolean().default(true),
  break_start: z.string().regex(TIME_REGEX, 'Invalid time format (HH:MM)').optional(),
  break_end: z.string().regex(TIME_REGEX, 'Invalid time format (HH:MM)').optional(),
  is_active: z.boolean().default(true),
})

export type DayOfWeek = typeof DAYS_OF_WEEK[number]
