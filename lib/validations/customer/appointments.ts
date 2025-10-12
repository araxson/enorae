import { z } from 'zod'

export const rescheduleSchema = z.object({
  newStartTime: z.string().datetime(),
  reason: z.string().optional(),
})
