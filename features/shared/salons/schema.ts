import { z } from 'zod'

export const salonsSchema = z.object({})
export type SalonsSchema = z.infer<typeof salonsSchema>
