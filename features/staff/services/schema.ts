import { z } from 'zod'

export const servicesSchema = z.object({})
export type ServicesSchema = z.infer<typeof servicesSchema>
