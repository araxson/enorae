import { z } from 'zod'

/**
 * Validation schema for customer booking form
 * Validates appointment date, time, service and staff selection
 */
export const bookingSchema = z.object({
  salonId: z.string().uuid('Invalid salon ID'),
  serviceId: z.string().uuid('Please select a service'),
  staffId: z.string().uuid('Please select a staff member'),
  appointmentDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const appointmentDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return appointmentDate >= today
    }, {
      message: 'Appointment date must be today or in the future',
    }),
  appointmentTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

/**
 * Inferred TypeScript type from booking schema
 */
export type BookingSchema = z.infer<typeof bookingSchema>
