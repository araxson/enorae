import { z } from 'zod'

export const homeSchema = z.object({})
export type HomeSchema = z.infer<typeof homeSchema>
