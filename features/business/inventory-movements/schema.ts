import { z } from 'zod'

export const inventoryMovementsSchema = z.object({})
export type InventoryMovementsSchema = z.infer<typeof inventoryMovementsSchema>
