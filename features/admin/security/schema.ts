import { z } from 'zod'

export const adminSecuritySchema = z.object({})
export type AdminSecuritySchema = z.infer<typeof adminSecuritySchema>
