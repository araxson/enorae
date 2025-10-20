import { z } from 'zod'

export const inventoryAlertsSchema = z.object({})
export type InventoryAlertsSchema = z.infer<typeof inventoryAlertsSchema>
