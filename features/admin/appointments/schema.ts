import { z } from 'zod'

export const adminAppointmentsSchema = z.object({})
export type AdminAppointmentsSchema = z.infer<typeof adminAppointmentsSchema>
