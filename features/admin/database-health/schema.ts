import { z } from 'zod'

export const adminDatabaseHealthSchema = z.object({})
export type AdminDatabaseHealthSchema = z.infer<typeof adminDatabaseHealthSchema>
