import { z } from 'zod'

export const threadMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  thread_id: z.string().uuid('Invalid thread ID'),
})

export const messageThreadSchema = threadMessageSchema

export type MessageThreadInput = z.infer<typeof threadMessageSchema>
export type ThreadMessageFormData = z.infer<typeof threadMessageSchema>
