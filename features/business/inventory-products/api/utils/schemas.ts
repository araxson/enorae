'use server'

import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const transferStockSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  fromLocationId: z.string().regex(UUID_REGEX),
  toLocationId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export const adjustStockSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  locationId: z.string().regex(UUID_REGEX),
  quantity: z.number().int(),
  adjustmentType: z.enum(['add', 'subtract', 'set']),
  reason: z.string().min(1).max(500),
})
