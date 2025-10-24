import { z } from 'zod'

export const unblockIdentifierSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
})

export const adjustLimitSchema = z.object({
  ruleId: z.string().uuid('Invalid rule ID'),
  newLimit: z.number().int().min(1, 'Limit must be at least 1'),
  duration: z.enum(['1hour', '1day', '1week', 'permanent']),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
})

export const purgeStaleSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  endpoint: z.string().min(1, 'Endpoint is required'),
})

export type UnblockIdentifierInput = z.infer<typeof unblockIdentifierSchema>
export type AdjustLimitInput = z.infer<typeof adjustLimitSchema>
export type PurgeStaleInput = z.infer<typeof purgeStaleSchema>
