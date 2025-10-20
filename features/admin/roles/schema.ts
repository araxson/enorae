import { z } from 'zod'

export const adminRolesSchema = z.object({})
export type AdminRolesSchema = z.infer<typeof adminRolesSchema>
