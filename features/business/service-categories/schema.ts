import { z } from 'zod'

export const serviceCategoriesSchema = z.object({})
export type ServiceCategoriesSchema = z.infer<typeof serviceCategoriesSchema>
