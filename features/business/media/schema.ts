import { z } from 'zod'

export const mediaSchema = z.object({})
export type MediaSchema = z.infer<typeof mediaSchema>
