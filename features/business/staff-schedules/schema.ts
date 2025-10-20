import { z } from 'zod'

export const staffSchedulesSchema = z.object({})
export type StaffSchedulesSchema = z.infer<typeof staffSchedulesSchema>
