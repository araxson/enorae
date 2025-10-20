import { z } from 'zod'

export const webhooksSchema = z.object({})
export type WebhooksSchema = z.infer<typeof webhooksSchema>
