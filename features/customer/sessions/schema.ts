import { z } from 'zod'

export const revokeSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID format'),
})

export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>
