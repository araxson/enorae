import { z } from 'zod'

export const analyticsSchema = z.object({})
export type AnalyticsSchema = z.infer<typeof analyticsSchema>
