import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const operatingHoursEntrySchema = z.object({
  day_of_week: z.number()
    .int('Day must be a whole number')
    .min(0, 'Day must be between 0 (Sunday) and 6 (Saturday)')
    .max(6, 'Day must be between 0 (Sunday) and 6 (Saturday)'),
  is_open: z.boolean().default(true),
  open_time: z.string()
    .regex(timeRegex, 'Open time must be in HH:MM format (e.g., 09:00)')
    .optional()
    .nullable(),
  close_time: z.string()
    .regex(timeRegex, 'Close time must be in HH:MM format (e.g., 17:00)')
    .optional()
    .nullable(),
  breaks: z.array(
    z.object({
      start_time: z.string().regex(timeRegex, 'Break start time must be in HH:MM format'),
      end_time: z.string().regex(timeRegex, 'Break end time must be in HH:MM format'),
    }).refine((data) => data.end_time > data.start_time, {
      message: 'Break end time must be after start time',
      path: ['end_time'],
    })
  ).optional().default([]),
}).refine((data) => {
  if (data.is_open && (!data.open_time || !data.close_time)) {
    return false
  }
  return true
}, {
  message: 'Open and close times are required when the business is open',
  path: ['open_time'],
}).refine((data) => {
  if (data.is_open && data.open_time && data.close_time) {
    return data.close_time > data.open_time
  }
  return true
}, {
  message: 'Close time must be after open time',
  path: ['close_time'],
})

export const weeklyOperatingHoursSchema = z.object({
  salon_id: z.string().uuid('Invalid salon ID'),
  hours: z.array(operatingHoursEntrySchema)
    .length(7, 'Must provide hours for all 7 days of the week'),
  timezone: z.string().min(1, 'Timezone is required').optional(),
})

export const operatingHoursSchema = z.object({})
export type OperatingHoursSchema = z.infer<typeof operatingHoursSchema>
export type OperatingHoursEntrySchema = z.infer<typeof operatingHoursEntrySchema>
export type WeeklyOperatingHoursSchema = z.infer<typeof weeklyOperatingHoursSchema>
