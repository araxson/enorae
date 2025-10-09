import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  fullName: z.string().min(1).max(200).optional(),
})

export const suspendUserSchema = z.object({
  userId: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  reason: z.string().optional(),
})
