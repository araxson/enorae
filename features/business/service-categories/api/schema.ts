import { z } from 'zod'

// NOTE: description, displayOrder, and iconName are not in the database schema
// The catalog.service_categories table only has: id, salon_id, parent_id, path, depth, name, slug, is_active, timestamps
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
  parentId: z.string().uuid('Invalid parent category').optional().nullable(),
})

export const serviceCategoriesSchema = z.object({})
export type ServiceCategoriesSchema = z.infer<typeof serviceCategoriesSchema>
export type CategorySchema = z.infer<typeof categorySchema>
