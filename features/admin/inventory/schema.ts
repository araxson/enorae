import { z } from 'zod'

export const inventorySchema = z.object({})
export type InventorySchema = z.infer<typeof inventorySchema>
