import { z } from 'zod'

const isoDateSchema = z
  .string()
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Invalid date format')

export const analyticsSchema = z.object({
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  period: z.enum(['30d', '90d', '12m']).default('12m'),
})

export type AnalyticsFilterInput = z.infer<typeof analyticsSchema>
