import { z } from 'zod'

export const blockedTimesSchema = z.object({})
export type BlockedTimesSchema = z.infer<typeof blockedTimesSchema>
