import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const assignServiceSchema = z.object({
  staffId: z.string().regex(UUID_REGEX),
  serviceId: z.string().regex(UUID_REGEX),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  priceOverride: z.number().nonnegative().optional(),
  durationOverride: z.number().positive().optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
})
