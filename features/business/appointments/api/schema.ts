import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Appointment status enumeration
 */
export const appointmentStatusEnum = z.enum([
  'pending',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'rescheduled',
])


/**
 * Add service to appointment schema
 * For adding a new service to an existing appointment
 */
export const addServiceSchema = z.object({
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID'),
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID'),
  start_time: z
    .string()
    .datetime('Invalid datetime format')
    .refine(
      (date) => {
        const startTime = new Date(date)
        const now = new Date()
        return startTime >= now
      },
      {
        message: 'Start time cannot be in the past',
      }
    ),
  duration_minutes: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(5, 'Service must be at least 5 minutes')
    .max(480, 'Service cannot exceed 8 hours'),
  price_override: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

/**
 * Edit appointment service schema
 * For modifying an existing service within an appointment
 */
export const editAppointmentServiceSchema = z.object({
  appointment_service_id: z.string().regex(UUID_REGEX, 'Invalid appointment service ID'),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  start_time: z.string().datetime('Invalid datetime format').optional(),
  duration_minutes: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(5, 'Service must be at least 5 minutes')
    .max(480, 'Service cannot exceed 8 hours')
    .optional(),
  price_override: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'skipped']).optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

/**
 * Appointment reschedule schema
 * For rescheduling an appointment to a new date/time
 */
export const appointmentRescheduleSchema = z.object({
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID'),
  new_start_time: z
    .string()
    .datetime('Invalid datetime format')
    .refine(
      (date) => {
        const newStartTime = new Date(date)
        const now = new Date()
        return newStartTime > now
      },
      {
        message: 'New start time must be in the future',
      }
    ),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)').max(500, 'Reason is too long').optional(),
  notify_customer: z.boolean().default(true),
  notify_staff: z.boolean().default(true),
})

/**
 * Appointment cancellation schema
 * For cancelling an appointment
 */
export const appointmentCancellationSchema = z.object({
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID'),
  reason: z.string().min(10, 'Please provide a reason for cancellation (at least 10 characters)').max(500, 'Reason is too long'),
  cancelled_by: z.enum(['customer', 'staff', 'system']),
  apply_cancellation_fee: z.boolean().default(false),
  refund_amount: z.coerce
    .number()
    .min(0, 'Refund cannot be negative')
    .max(99999.99, 'Amount is too high')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places')
    .optional(),
  notify_customer: z.boolean().default(true),
  notify_staff: z.boolean().default(true),
})

/**
 * Appointment status update schema
 * For updating the status of an appointment
 */
export const appointmentStatusUpdateSchema = z.object({
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID'),
  status: appointmentStatusEnum,
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
  notify_customer: z.boolean().default(false),
})

/**
 * Bulk appointment action schema
 * For performing actions on multiple appointments at once
 */
export const bulkAppointmentActionSchema = z.object({
  appointment_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid appointment ID'))
    .min(1, 'Select at least one appointment')
    .max(100, 'Cannot act on more than 100 appointments at once'),
  action: z.enum(['confirm', 'cancel', 'send_reminder', 'mark_no_show']),
  reason: z.string().max(500, 'Reason must be 500 characters or fewer').optional(),
})

/**
 * Appointment search/filter schema
 * For finding appointments by various criteria
 */
export const appointmentSearchSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  customer_id: z.string().regex(UUID_REGEX, 'Invalid customer ID').optional(),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID').optional(),
  status: appointmentStatusEnum.optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  min_total_amount: z.coerce.number().min(0).optional(),
  max_total_amount: z.coerce.number().min(0).optional(),
  has_notes: z.boolean().optional(),
  is_first_visit: z.boolean().optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type AddServiceSchema = z.infer<typeof addServiceSchema>
export type EditAppointmentServiceSchema = z.infer<typeof editAppointmentServiceSchema>
export type AppointmentRescheduleSchema = z.infer<typeof appointmentRescheduleSchema>
export type AppointmentCancellationSchema = z.infer<typeof appointmentCancellationSchema>
export type AppointmentStatusUpdateSchema = z.infer<typeof appointmentStatusUpdateSchema>
export type BulkAppointmentActionSchema = z.infer<typeof bulkAppointmentActionSchema>
export type AppointmentSearchSchema = z.infer<typeof appointmentSearchSchema>
