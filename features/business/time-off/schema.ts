import { z } from 'zod'

export const timeOffSchema = z.object({})
export type TimeOffSchema = z.infer<typeof timeOffSchema>
