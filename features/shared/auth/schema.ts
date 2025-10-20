import { z } from 'zod'

export const authSchema = z.object({})
export type AuthSchema = z.infer<typeof authSchema>
