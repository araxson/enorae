import { z } from 'zod'

export const quarantineSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
})

export const requireMfaSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
})

export const evictSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
})

export const overrideSeveritySchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  newRiskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
})

export type QuarantineSessionInput = z.infer<typeof quarantineSessionSchema>
export type RequireMfaInput = z.infer<typeof requireMfaSchema>
export type EvictSessionInput = z.infer<typeof evictSessionSchema>
export type OverrideSeverityInput = z.infer<typeof overrideSeveritySchema>
