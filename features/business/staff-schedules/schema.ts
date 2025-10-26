import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const staffScheduleEntrySchema = z.object({
  staff_id: z.string().uuid('Invalid staff ID'),
  day_of_week: z.number()
    .int('Day must be a whole number')
    .min(0, 'Day must be between 0 (Sunday) and 6 (Saturday)')
    .max(6, 'Day must be between 0 (Sunday) and 6 (Saturday)'),
  is_available: z.boolean().default(true),
  start_time: z.string()
    .regex(timeRegex, 'Start time must be in HH:MM format (e.g., 09:00)')
    .optional()
    .nullable(),
  end_time: z.string()
    .regex(timeRegex, 'End time must be in HH:MM format (e.g., 17:00)')
    .optional()
    .nullable(),
  break_start: z.string()
    .regex(timeRegex, 'Break start must be in HH:MM format')
    .optional()
    .nullable(),
  break_end: z.string()
    .regex(timeRegex, 'Break end must be in HH:MM format')
    .optional()
    .nullable(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable(),
}).refine((data) => {
  if (data.is_available && (!data.start_time || !data.end_time)) {
    return false
  }
  return true
}, {
  message: 'Start and end times are required when staff is available',
  path: ['start_time'],
}).refine((data) => {
  if (data.is_available && data.start_time && data.end_time) {
    return data.end_time > data.start_time
  }
  return true
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
}).refine((data) => {
  if (data.break_start && data.break_end) {
    return data.break_end > data.break_start
  }
  return true
}, {
  message: 'Break end must be after break start',
  path: ['break_end'],
})

export const staffWeeklyScheduleSchema = z.object({
  staff_id: z.string().uuid('Invalid staff ID'),
  salon_id: z.string().uuid('Invalid salon ID'),
  schedule: z.array(staffScheduleEntrySchema)
    .max(7, 'Cannot have more than 7 days in a week'),
})

export const staffScheduleOverrideSchema = z.object({
  staff_id: z.string().uuid('Invalid staff ID'),
  date: z.string()
    .refine((date) => {
      const d = new Date(date)
      return !isNaN(d.getTime())
    }, 'Invalid date format'),
  is_available: z.boolean(),
  start_time: z.string().regex(timeRegex, 'Start time must be in HH:MM format').optional().nullable(),
  end_time: z.string().regex(timeRegex, 'End time must be in HH:MM format').optional().nullable(),
  reason: z.string()
    .max(200, 'Reason must be less than 200 characters')
    .optional()
    .nullable(),
})

export const staffSchedulesSchema = z.object({})
export type StaffSchedulesSchema = z.infer<typeof staffSchedulesSchema>
export type StaffScheduleEntrySchema = z.infer<typeof staffScheduleEntrySchema>
export type StaffWeeklyScheduleSchema = z.infer<typeof staffWeeklyScheduleSchema>
export type StaffScheduleOverrideSchema = z.infer<typeof staffScheduleOverrideSchema>
