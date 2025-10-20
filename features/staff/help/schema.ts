import { z } from 'zod'

export const helpSchema = z.object({})
export type HelpSchema = z.infer<typeof helpSchema>
