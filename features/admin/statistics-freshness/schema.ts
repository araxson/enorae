import { z } from 'zod'

export const refreshStatsSchema = z.object({
  tableName: z.string().min(1, 'Table name is required'),
})

export type RefreshStatsInput = z.infer<typeof refreshStatsSchema>
