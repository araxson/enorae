import { z } from 'zod'

export const pricingSchema = z.object({})
export type PricingSchema = z.infer<typeof pricingSchema>
