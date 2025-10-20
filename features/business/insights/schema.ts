import { z } from 'zod'

export const insightsSchema = z.object({})
export type InsightsSchema = z.infer<typeof insightsSchema>
