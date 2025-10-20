import { z } from 'zod'

export const sessionsSchema = z.object({})
export type SessionsSchema = z.infer<typeof sessionsSchema>
