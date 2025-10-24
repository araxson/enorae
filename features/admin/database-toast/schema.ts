import { z } from 'zod'

export const optimizeColumnSchema = z.object({
  tableName: z.string().min(1, 'Table name is required'),
  columnName: z.string().min(1, 'Column name is required'),
  compressionType: z.enum(['pglz', 'lz4']),
})

export type OptimizeColumnInput = z.infer<typeof optimizeColumnSchema>
