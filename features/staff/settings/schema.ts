import { z } from 'zod'

export const settingsSchema = z.object({})
export type SettingsSchema = z.infer<typeof settingsSchema>
