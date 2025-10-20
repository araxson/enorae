import { z } from 'zod'

export const rescheduleSchema = z.object({
  newStartTime: z
    .string()
    .datetime({ message: 'Please select a future date and time.' })
    .refine((value) => new Date(value) > new Date(), {
      message: 'New appointment must be in the future',
    }),
  reason: z
    .string()
    .max(500, 'Reason must be 500 characters or fewer')
    .optional(),
})
