import { z } from 'zod'

export const settingsRolesSchema = z.object({})
export type SettingsRolesSchema = z.infer<typeof settingsRolesSchema>
