import { z } from 'zod'

export const salonSearchSchema = z.object({})
export type SalonSearchSchema = z.infer<typeof salonSearchSchema>
