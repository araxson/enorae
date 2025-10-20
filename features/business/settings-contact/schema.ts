import { z } from 'zod'

export const settingsContactSchema = z.object({})
export type SettingsContactSchema = z.infer<typeof settingsContactSchema>
