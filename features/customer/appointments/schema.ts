import { z } from 'zod'

import { rescheduleSchema } from '@/lib/validations/customer/appointments'

export const appointmentRescheduleSchema = rescheduleSchema
export type AppointmentRescheduleInput = z.infer<typeof appointmentRescheduleSchema>
