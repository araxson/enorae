import { z } from 'zod'

export const inventoryPurchaseOrdersSchema = z.object({})
export type InventoryPurchaseOrdersSchema = z.infer<typeof inventoryPurchaseOrdersSchema>
