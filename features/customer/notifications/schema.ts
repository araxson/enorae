import { z } from 'zod'

export const notificationsSchema = z.object({})
export type NotificationsSchema = z.infer<typeof notificationsSchema>
