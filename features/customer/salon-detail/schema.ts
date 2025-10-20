import { z } from 'zod'

export const salonDetailSchema = z.object({})
export type SalonDetailSchema = z.infer<typeof salonDetailSchema>
