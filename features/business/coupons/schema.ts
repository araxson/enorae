import { z } from 'zod'

export const couponsSchema = z.object({})
export type CouponsSchema = z.infer<typeof couponsSchema>
