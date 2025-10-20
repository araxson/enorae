import { z } from 'zod'

export const inventoryUsageSchema = z.object({})
export type InventoryUsageSchema = z.infer<typeof inventoryUsageSchema>
