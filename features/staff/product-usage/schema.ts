import { z } from 'zod'

export const productUsageSchema = z.object({
  appointment_id: z.string().uuid(),
  product_id: z.string().uuid(),
  location_id: z.string().uuid(),
  quantity_used: z.number().positive('Quantity must be positive'),
  notes: z.string().max(1000).optional().nullable(),
})

export type ProductUsageFormData = z.infer<typeof productUsageSchema>
