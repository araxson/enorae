import { z } from 'zod'

export const exploreSchema = z.object({})
export type ExploreSchema = z.infer<typeof exploreSchema>
