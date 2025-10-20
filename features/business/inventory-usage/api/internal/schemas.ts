import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const UUID_MESSAGE = 'Must be a valid UUID'
const POSITIVE_QUANTITY_MESSAGE = 'Quantity must be greater than zero'
const POSITIVE_RATE_MESSAGE = 'Rate must be greater than zero'
const NOTES_LENGTH_MESSAGE = 'Notes must be 500 characters or less'

export const recordUsageSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, UUID_MESSAGE).optional().nullable(),
  appointmentId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  productId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  locationId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  quantity: z.number().positive({ message: POSITIVE_QUANTITY_MESSAGE }),
  notes: z.string().max(500, NOTES_LENGTH_MESSAGE).optional().or(z.literal('')),
})

export const bulkUsageItemSchema = z.object({
  productId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  locationId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  quantity: z.number().positive({ message: POSITIVE_QUANTITY_MESSAGE }),
})

export const bulkRecordUsageSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, UUID_MESSAGE).optional().nullable(),
  appointmentId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  products: z.array(bulkUsageItemSchema).min(1),
  notes: z.string().max(500, NOTES_LENGTH_MESSAGE).optional().or(z.literal('')),
})

export const updateUsageRateSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  productId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
  rate: z.number().positive({ message: POSITIVE_RATE_MESSAGE }),
})

export const deleteUsageSchema = z.object({
  usageId: z.string().regex(UUID_REGEX, UUID_MESSAGE),
})

export const USAGE_PATH = '/business/inventory/usage'
export const INVENTORY_SCHEMA = 'inventory'
