import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const scheduleSchema = z.object({
  staff_id: z.string().uuid(),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  break_start: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
  break_end: z.string().regex(/^\d{2}:\d{2}:\d{2}$/).optional(),
  is_active: z.boolean().default(true),
})

export type DayOfWeek = z.infer<typeof scheduleSchema>['day_of_week']
