import { z } from 'zod'

/**
 * Schema for session ID validation
 * Enforces valid UUID format for session identifiers
 */
export const sessionIdSchema = z.string().uuid('Invalid session ID format')

/**
 * Schema for revoking a specific session
 * Validates session ID format
 */
export const revokeSessionSchema = z.object({
  sessionId: sessionIdSchema,
})

/**
 * Type exports for mutations
 */
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>
