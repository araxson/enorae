import { z } from 'zod'

export const preferencesSchema = z.object({})
export type PreferencesSchema = z.infer<typeof preferencesSchema>
