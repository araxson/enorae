import { z } from 'zod'

export const supportSchema = z.object({})
export type SupportSchema = z.infer<typeof supportSchema>
