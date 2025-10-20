import { z } from 'zod'

export const servicePricingSchema = z.object({})
export type ServicePricingSchema = z.infer<typeof servicePricingSchema>
