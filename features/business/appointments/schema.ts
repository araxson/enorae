import { z } from 'zod'

export const appointmentsSchema = z.object({})
export type AppointmentsSchema = z.infer<typeof appointmentsSchema>
