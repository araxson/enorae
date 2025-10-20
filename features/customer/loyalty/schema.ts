import { z } from 'zod'

export const loyaltySchema = z.object({})
export type LoyaltySchema = z.infer<typeof loyaltySchema>
