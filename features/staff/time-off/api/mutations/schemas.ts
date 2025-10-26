import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const requestSchema = z.object({
  staffId: z.string().regex(UUID_REGEX),
  startAt: z.string(),
  endAt: z.string(),
  requestType: z.enum(['vacation', 'sick_leave', 'personal', 'other']),
  reason: z.string().optional(),
  isAutoReschedule: z.boolean().optional(),
  isNotifyCustomers: z.boolean().optional(),
})

export { UUID_REGEX }
