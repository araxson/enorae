import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const ruleSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  durationMinutes: z.number().int().min(0, 'Duration must be non-negative').optional(),
  bufferMinutes: z.number().int().min(0, 'Buffer must be non-negative').optional(),
  minAdvanceBookingHours: z.number().int().min(0, 'Minimum advance booking must be non-negative').optional(),
  maxAdvanceBookingDays: z.number().int().min(0, 'Maximum advance booking must be non-negative').optional(),
})
