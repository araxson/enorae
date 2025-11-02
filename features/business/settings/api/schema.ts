import { z } from 'zod'

/**
 * Booking rules validation schema
 * Controls how customers can book appointments
 */
export const bookingRulesSchema = z.object({
  booking_lead_time_hours: z.coerce
    .number()
    .int('Lead time must be a whole number')
    .min(0, 'Lead time cannot be negative')
    .max(720, 'Lead time cannot exceed 30 days')
    .optional(),
  max_bookings_per_day: z.coerce
    .number()
    .int('Max bookings must be a whole number')
    .min(1, 'Must allow at least 1 booking per day')
    .max(1000, 'Max bookings seems too high')
    .optional(),
  max_services: z.coerce
    .number()
    .int('Max services must be a whole number')
    .min(1, 'Must allow at least 1 service')
    .max(100, 'Max services seems too high')
    .optional(),
  allow_same_day_booking: z.boolean().default(true),
  require_deposit: z.boolean().default(false),
  deposit_percentage: z.coerce
    .number()
    .min(0, 'Deposit cannot be negative')
    .max(100, 'Deposit cannot exceed 100%')
    .optional(),
})

/**
 * Cancellation policy validation schema
 * Controls refund rules and cancellation windows
 */
export const cancellationPolicySchema = z.object({
  cancellation_window_hours: z.coerce
    .number()
    .int('Cancellation window must be whole hours')
    .min(0, 'Window cannot be negative')
    .max(168, 'Window cannot exceed 7 days')
    .optional(),
  refund_percentage: z.coerce
    .number()
    .min(0, 'Refund cannot be negative')
    .max(100, 'Refund cannot exceed 100%')
    .optional(),
  no_show_fee: z.coerce
    .number()
    .min(0, 'Fee cannot be negative')
    .max(999.99, 'Fee seems too high')
    .optional(),
  late_cancellation_fee: z.coerce
    .number()
    .min(0, 'Fee cannot be negative')
    .max(999.99, 'Fee seems too high')
    .optional(),
})

/**
 * Booking status schema
 * Controls whether salon is accepting new bookings
 */
export const bookingStatusSchema = z.object({
  is_accepting_bookings: z.boolean().default(true),
  booking_pause_reason: z.string().max(500, 'Reason must be 500 characters or fewer').optional(),
  booking_pause_until: z
    .string()
    .datetime('Invalid datetime format')
    .optional()
    .nullable(),
})

/**
 * Account limits schema
 * Controls operational limits for the salon
 */
export const accountLimitsSchema = z.object({
  max_staff_members: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 staff member')
    .max(1000, 'Limit seems too high')
    .optional(),
  max_services: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 service')
    .max(1000, 'Limit seems too high')
    .optional(),
  max_locations: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 location')
    .max(100, 'Limit seems too high')
    .optional(),
})

/**
 * Combined salon settings schema
 * Used for updating all settings at once
 */
export const salonSettingsSchema = bookingRulesSchema
  .merge(cancellationPolicySchema)
  .merge(bookingStatusSchema)
  .merge(accountLimitsSchema)

/**
 * Inferred TypeScript types from schemas
 */
export type BookingRulesSchema = z.infer<typeof bookingRulesSchema>
export type CancellationPolicySchema = z.infer<typeof cancellationPolicySchema>
export type BookingStatusSchema = z.infer<typeof bookingStatusSchema>
export type AccountLimitsSchema = z.infer<typeof accountLimitsSchema>
export type SalonSettingsSchema = z.infer<typeof salonSettingsSchema>
