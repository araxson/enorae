import { z } from 'zod'

export const inventorySuppliersSchema = z.object({})
export type InventorySuppliersSchema = z.infer<typeof inventorySuppliersSchema>
