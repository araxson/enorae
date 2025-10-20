import { z } from 'zod'

export const operatingHoursSchema = z.object({})
export type OperatingHoursSchema = z.infer<typeof operatingHoursSchema>
