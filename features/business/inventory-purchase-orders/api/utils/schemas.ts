import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const orderItemSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
})

export const orderSchema = z.object({
  supplierId: z.string().regex(UUID_REGEX),
  orderDate: z.string(),
  expectedDeliveryDate: z.string().optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
})

export const statusSchema = z.enum([
  'pending',
  'approved',
  'ordered',
  'received',
  'cancelled',
])
