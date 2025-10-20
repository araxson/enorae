import { z } from 'zod'

export const messagingSchema = z.object({})
export type MessagingSchema = z.infer<typeof messagingSchema>
