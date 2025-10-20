import { z } from 'zod'

export const adminSettingsSchema = z.object({})
export type AdminSettingsSchema = z.infer<typeof adminSettingsSchema>
