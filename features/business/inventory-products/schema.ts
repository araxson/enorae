import { z } from 'zod'

export const inventoryProductsSchema = z.object({})
export type InventoryProductsSchema = z.infer<typeof inventoryProductsSchema>
