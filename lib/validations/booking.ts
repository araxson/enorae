import { z } from 'zod'

/**
 * Booking Form Validation Schema
 */
export const bookingSchema = z.object({
  serviceId: z
    .string()
    .min(1, 'Please select a service')
    .uuid('Invalid service ID'),
  staffId: z
    .string()
    .min(1, 'Please select a staff member')
    .uuid('Invalid staff ID'),
  appointmentDate: z
    .string()
    .min(1, 'Please select a date')
    .refine((date) => {
      const selected = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, 'Appointment date must be in the future'),
  appointmentTime: z
    .string()
    .min(1, 'Please select a time')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>
