import { z } from 'zod'

export const adminProfileSchema = z.object({})
export type AdminProfileSchema = z.infer<typeof adminProfileSchema>
