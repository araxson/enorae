import { z } from 'zod'

export const locationSchema = z.object({})
export type LocationSchema = z.infer<typeof locationSchema>
