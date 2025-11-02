import { z } from 'zod'

export const threadMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
  thread_id: z.string().uuid('Invalid thread ID'),
})

export type ThreadMessageFormData = z.infer<typeof threadMessageSchema>
