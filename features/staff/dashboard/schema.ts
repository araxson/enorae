import { z } from 'zod'

export const dashboardSchema = z.object({})
export type DashboardSchema = z.infer<typeof dashboardSchema>
