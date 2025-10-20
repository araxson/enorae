import { z } from 'zod'

export const adminMessagesSchema = z.object({})
export type AdminMessagesSchema = z.infer<typeof adminMessagesSchema>
