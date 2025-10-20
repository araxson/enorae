import { z } from 'zod'

export const salonDirectorySchema = z.object({})
export type SalonDirectorySchema = z.infer<typeof salonDirectorySchema>
