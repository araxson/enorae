import { z } from 'zod'

export const servicesDirectorySchema = z.object({})
export type ServicesDirectorySchema = z.infer<typeof servicesDirectorySchema>
