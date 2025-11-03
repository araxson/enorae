import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Service status enumeration
 */
export const serviceStatusEnum = z.enum(['active', 'inactive', 'draft', 'archived'])


/**
 * Service category enumeration (common salon service categories)
 */
export const serviceCategoryEnum = z.enum([
  'haircut',
  'coloring',
  'styling',
  'treatment',
  'nails',
  'facial',
  'massage',
  'waxing',
  'makeup',
  'other',
])


/**
 * Service creation/update schema
 * Validates all service details including pricing, duration, and availability
 */
export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, 'Service name must be at least 3 characters')
    .max(200, 'Service name must be 200 characters or fewer')
    .refine(
      (val) => {
        // Ensure name isn't just numbers or special characters
        const hasLetters = /[a-zA-Z]/.test(val)
        return hasLetters
      },
      {
        message: 'Service name must contain letters',
      }
    ),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters to help customers understand the service')
    .max(1000, 'Description must be 1000 characters or fewer')
    .optional(),
  category_id: z.string().regex(UUID_REGEX, 'Invalid category ID').optional(),
  duration_minutes: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(5, 'Service must be at least 5 minutes')
    .max(480, 'Service cannot exceed 8 hours'),
  buffer_minutes: z.coerce
    .number()
    .int('Buffer must be in whole minutes')
    .min(0, 'Buffer cannot be negative')
    .max(120, 'Buffer cannot exceed 2 hours')
    .default(0),
  base_price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., USD)').default('USD'),
  status: serviceStatusEnum.default('active'),
  requires_deposit: z.boolean().default(false),
  deposit_amount: z.coerce
    .number()
    .min(0, 'Deposit cannot be negative')
    .max(99999.99, 'Deposit is too high')
    .multipleOf(0.01, 'Deposit must have at most 2 decimal places')
    .optional(),
  max_advance_booking_days: z.coerce
    .number()
    .int('Must be whole days')
    .min(0, 'Cannot be negative')
    .max(365, 'Cannot exceed 1 year')
    .optional(),
  min_advance_booking_hours: z.coerce
    .number()
    .int('Must be whole hours')
    .min(0, 'Cannot be negative')
    .max(720, 'Cannot exceed 30 days')
    .optional(),
  cancellation_notice_hours: z.coerce
    .number()
    .int('Must be whole hours')
    .min(0, 'Cannot be negative')
    .max(168, 'Cannot exceed 7 days')
    .optional(),
  is_online_booking_enabled: z.boolean().default(true),
  max_simultaneous_bookings: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 booking')
    .max(100, 'Limit seems too high')
    .default(1),
  tags: z
    .array(z.string().min(2, 'Tag must be at least 2 characters').max(50, 'Tag is too long'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  preparation_notes: z.string().max(500, 'Preparation notes must be 500 characters or fewer').optional(),
  aftercare_notes: z.string().max(500, 'Aftercare notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // If deposit is required, deposit amount must be set
    if (data.requires_deposit && !data.deposit_amount) {
      return false
    }
    return true
  },
  {
    message: 'Deposit amount is required when deposit is enabled',
    path: ['deposit_amount'],
  }
).refine(
  (data) => {
    // Deposit cannot exceed base price
    if (data.deposit_amount && data.deposit_amount > data.base_price) {
      return false
    }
    return true
  },
  {
    message: 'Deposit amount cannot exceed base price',
    path: ['deposit_amount'],
  }
)

/**
 * Service availability schema
 * Defines when a service is available for booking
 */
export const serviceAvailabilitySchema = z.object({
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  day_of_week: z.coerce
    .number()
    .int('Day must be a whole number')
    .min(0, 'Sunday is 0')
    .max(6, 'Saturday is 6'),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
  is_available: z.boolean().default(true),
}).refine(
  (data) => {
    // End time must be after start time
    const startParts = data.start_time.split(':').map(Number)
    const endParts = data.end_time.split(':').map(Number)
    const startHour = startParts[0] ?? 0
    const startMin = startParts[1] ?? 0
    const endHour = endParts[0] ?? 0
    const endMin = endParts[1] ?? 0
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return endMinutes > startMinutes
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
)

/**
 * Service add-on schema
 * For optional add-ons that can be included with a service
 */
export const serviceAddOnSchema = z.object({
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  name: z.string().min(3, 'Add-on name must be at least 3 characters').max(200, 'Name is too long'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
  price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(9999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  additional_duration_minutes: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(0, 'Duration cannot be negative')
    .max(240, 'Duration cannot exceed 4 hours')
    .default(0),
  is_active: z.boolean().default(true),
})

/**
 * Bulk service update schema
 * For updating multiple services at once
 */
export const bulkServiceUpdateSchema = z.object({
  service_ids: z.array(z.string().regex(UUID_REGEX, 'Invalid service ID')).min(1, 'Select at least one service'),
  updates: z.object({
    status: serviceStatusEnum.optional(),
    is_online_booking_enabled: z.boolean().optional(),
    category_id: z.string().regex(UUID_REGEX, 'Invalid category ID').optional(),
  }),
})

/**
 * Inferred TypeScript types from schemas
 */
export type ServiceSchema = z.output<typeof serviceSchema>
export type ServiceSchemaInput = z.input<typeof serviceSchema>
export type ServiceAvailabilitySchema = z.output<typeof serviceAvailabilitySchema>
export type ServiceAvailabilitySchemaInput = z.input<typeof serviceAvailabilitySchema>
export type ServiceAddOnSchema = z.output<typeof serviceAddOnSchema>
export type ServiceAddOnSchemaInput = z.input<typeof serviceAddOnSchema>
export type BulkServiceUpdateSchema = z.output<typeof bulkServiceUpdateSchema>
