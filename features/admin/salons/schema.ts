import { z } from 'zod'

export const adminSalonsSchema = z.object({})
export type AdminSalonsSchema = z.infer<typeof adminSalonsSchema>
