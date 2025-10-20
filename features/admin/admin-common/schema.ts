import { z } from 'zod'

export const adminCommonSchema = z.object({})
export type AdminCommonSchema = z.infer<typeof adminCommonSchema>
