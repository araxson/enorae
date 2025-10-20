import { z } from 'zod'

export const metricsSchema = z.object({})
export type MetricsSchema = z.infer<typeof metricsSchema>
