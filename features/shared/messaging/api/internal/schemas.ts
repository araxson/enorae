import { z } from 'zod'

// UUID validation regex
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Validation schemas
export const createThreadSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  subject: z.string().min(1, 'Subject is required').optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
})

export const sendMessageSchema = z.object({
  thread_id: z.string().regex(UUID_REGEX, 'Invalid thread ID'),
  content: z.string().min(1, 'Message content is required'),
})
