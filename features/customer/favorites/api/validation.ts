import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const favoriteSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID format'),
  notes: z.string().max(500).optional().nullable(),
})
