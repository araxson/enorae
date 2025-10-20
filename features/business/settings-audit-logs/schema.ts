import { z } from 'zod'

export const settingsAuditLogsSchema = z.object({})
export type SettingsAuditLogsSchema = z.infer<typeof settingsAuditLogsSchema>
