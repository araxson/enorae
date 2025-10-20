import { z } from 'zod'

export const inventoryLocationsSchema = z.object({})
export type InventoryLocationsSchema = z.infer<typeof inventoryLocationsSchema>
