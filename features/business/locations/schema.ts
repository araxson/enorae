import { z } from 'zod'

export const locationsSchema = z.object({})
export type LocationsSchema = z.infer<typeof locationsSchema>
