import { z } from 'zod'

import { bookingSchema } from '@/lib/validations/booking'

export const bookingFormSchema = bookingSchema

export type BookingFormValues = z.infer<typeof bookingFormSchema>
