import { z } from 'zod'
import { DATA_LIMITS } from '@/lib/config/constants'

export const messageSchema = z.object({
  to_user_id: z.string().uuid(),
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(DATA_LIMITS.MESSAGE_MAX_LENGTH),
  context_type: z.enum(['appointment', 'general', 'inquiry']).optional(),
  context_id: z.string().uuid().optional().nullable(),
})

export const threadMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(DATA_LIMITS.MESSAGE_MAX_LENGTH),
})

export type MessageFormData = z.infer<typeof messageSchema>
export type ThreadMessageFormData = z.infer<typeof threadMessageSchema>
