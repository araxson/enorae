import { z } from 'zod'

export const settingsDescriptionSchema = z.object({})
export type SettingsDescriptionSchema = z.infer<typeof settingsDescriptionSchema>
