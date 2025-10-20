import { z } from 'zod'

export const dailyAnalyticsSchema = z.object({})
export type DailyAnalyticsSchema = z.infer<typeof dailyAnalyticsSchema>
