import { z } from 'zod'

export const bookingRulesSchema = z.object({})
export type BookingRulesSchema = z.infer<typeof bookingRulesSchema>
