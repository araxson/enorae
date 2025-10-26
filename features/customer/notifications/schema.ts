import { z } from 'zod'

export const notificationsSchema = z.object({
  email: z.coerce.boolean().default(false),
  sms: z.coerce.boolean().default(false),
  push: z.coerce.boolean().default(false),
  marketing: z.coerce.boolean().default(false),
})

export type NotificationsPreferences = z.infer<typeof notificationsSchema>
