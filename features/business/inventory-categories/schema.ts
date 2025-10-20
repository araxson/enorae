import { z } from 'zod'

export const inventoryCategoriesSchema = z.object({})
export type InventoryCategoriesSchema = z.infer<typeof inventoryCategoriesSchema>
