import { z } from 'zod'

export const moderationSchema = z.object({})
export type ModerationSchema = z.infer<typeof moderationSchema>
