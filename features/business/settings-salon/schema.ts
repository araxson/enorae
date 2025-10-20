import { z } from 'zod'

export const settingsSalonSchema = z.object({})
export type SettingsSalonSchema = z.infer<typeof settingsSalonSchema>
