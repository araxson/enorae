import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const requestSchema = z
  .object({
    staffId: z.string().regex(UUID_REGEX),
    startAt: z.string().datetime({ message: 'Start date must be ISO-8601' }),
    endAt: z.string().datetime({ message: 'End date must be ISO-8601' }),
    requestType: z.enum(['vacation', 'sick_leave', 'personal', 'other']),
    reason: z.string().optional(),
    isAutoReschedule: z.boolean().optional(),
    isNotifyCustomers: z.boolean().optional(),
  })
  .refine(({ startAt, endAt }) => new Date(endAt).getTime() > new Date(startAt).getTime(), {
    message: 'End date must be after start date',
    path: ['endAt'],
  })
