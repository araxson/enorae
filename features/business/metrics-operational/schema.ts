import { z } from 'zod'

export const metricsOperationalSchema = z.object({})
export type MetricsOperationalSchema = z.infer<typeof metricsOperationalSchema>
