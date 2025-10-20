import { z } from 'zod'

export const scheduleSchema = z.object({})
export type ScheduleSchema = z.infer<typeof scheduleSchema>
