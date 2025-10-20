import { z } from 'zod'

export const adminDashboardSchema = z.object({})
export type AdminDashboardSchema = z.infer<typeof adminDashboardSchema>
