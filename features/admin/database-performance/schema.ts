import { z } from 'zod'

export const createIndexSchema = z.object({
  tableName: z.string().min(1, 'Table name is required'),
  columnName: z.string().min(1, 'Column name is required'),
  indexType: z.enum(['btree', 'hash', 'gist', 'gin']),
})

export type CreateIndexInput = z.infer<typeof createIndexSchema>
