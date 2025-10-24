import { z } from 'zod'

export const acknowledgeAlertSchema = z.object({
  accessId: z.string().uuid('Invalid access ID'),
})

export const dismissAlertSchema = z.object({
  accessId: z.string().uuid('Invalid access ID'),
})

export const suppressAlertSchema = z.object({
  accessId: z.string().uuid('Invalid access ID'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
  duration: z.enum(['1hour', '1day', '1week', 'permanent']),
})

export type AcknowledgeAlertInput = z.infer<typeof acknowledgeAlertSchema>
export type DismissAlertInput = z.infer<typeof dismissAlertSchema>
export type SuppressAlertInput = z.infer<typeof suppressAlertSchema>
