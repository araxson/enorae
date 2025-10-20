import { z } from 'zod'

export const discoverySchema = z.object({})
export type DiscoverySchema = z.infer<typeof discoverySchema>
