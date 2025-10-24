import { z } from 'zod'

// Schema for session data validation
export const sessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  is_active: z.boolean().nullable(),
  is_suspicious: z.boolean().nullable(),
  deleted_at: z.string().nullable(),
})

export const sessionWithMetadataSchema = sessionSchema.extend({
  is_current: z.boolean(),
})

export const revokeSessionSchema = z.object({
  sessionId: z.string().uuid(),
})
