import { z } from 'zod'

export const blockedTimeSchema = z.object({
  start_time: z.string(),
  end_time: z.string(),
  block_type: z.enum(['maintenance', 'other', 'break', 'vacation', 'sick_leave', 'training', 'personal', 'lunch', 'holiday']),
  reason: z.string().min(1, 'Reason is required').max(500),
  is_recurring: z.boolean(),
  recurrence_pattern: z.string().nullable().optional(),
}).refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
)

export type BlockedTimeFormData = z.infer<typeof blockedTimeSchema>
