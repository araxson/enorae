import { z } from 'zod'

export const webhooksMonitoringSchema = z.object({})
export type WebhooksMonitoringSchema = z.infer<typeof webhooksMonitoringSchema>
