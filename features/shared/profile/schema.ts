import { z } from 'zod'

export const profileSchema = z.object({})
export type ProfileSchema = z.infer<typeof profileSchema>
