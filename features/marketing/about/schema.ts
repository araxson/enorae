import { z } from 'zod'

export const aboutSchema = z.object({})
export type AboutSchema = z.infer<typeof aboutSchema>
