import { z } from 'zod'

export const serviceProductUsageSchema = z.object({})
export type ServiceProductUsageSchema = z.infer<typeof serviceProductUsageSchema>
