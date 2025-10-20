import { z } from 'zod'

export const customerAnalyticsSchema = z.object({})
export type CustomerAnalyticsSchema = z.infer<typeof customerAnalyticsSchema>
