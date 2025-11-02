import { z } from 'zod'
import { UUID_REGEX } from '@/lib/validations/shared'

/**
 * Schema for revoking a session
 */
export const revokeSessionSchema = z.object({
  sessionId: z.string()
    .regex(UUID_REGEX, 'Invalid session ID format')
    .describe('The UUID of the session to revoke'),
})

export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>
