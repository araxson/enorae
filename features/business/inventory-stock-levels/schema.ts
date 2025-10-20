import { z } from 'zod'

export const inventoryStockLevelsSchema = z.object({})
export type InventoryStockLevelsSchema = z.infer<typeof inventoryStockLevelsSchema>
