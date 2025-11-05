import { z } from 'zod'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Service name is required')
    .max(120, 'Service name must be 120 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be 2000 characters or fewer')
    .optional(),
  category_id: z.string().uuid('Invalid category').optional(),
  is_active: z.boolean(),
  is_bookable: z.boolean(),
  is_featured: z.boolean(),
})

export const pricingSchema = z
  .object({
    base_price: z.number().min(0, 'Base price must be positive'),
    sale_price: z.number().min(0, 'Sale price cannot be negative').nullable().optional(),
    currency_code: z
      .string()
      .trim()
      .length(3, 'Currency code must be a 3-letter ISO code')
      .transform((code) => code.toUpperCase()),
    is_taxable: z.boolean().optional(),
    tax_rate: z
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(100, 'Tax rate cannot exceed 100%')
      .nullable()
      .optional(),
    commission_rate: z
      .number()
      .min(0, 'Commission rate cannot be negative')
      .max(100, 'Commission rate cannot exceed 100%')
      .nullable()
      .optional(),
    cost: z.number().min(0, 'Cost cannot be negative').nullable().optional(),
  })
  .refine(
    (data) => data.sale_price == null || data.sale_price <= data.base_price,
    { message: 'Sale price cannot exceed the base price', path: ['sale_price'] },
  )

export const bookingRulesSchema = z
  .object({
    duration_minutes: z
      .number()
      .int('Duration must be a whole number')
      .min(1, 'Duration must be at least one minute'),
    buffer_minutes: z
      .number()
      .int('Buffer must be a whole number')
      .min(0, 'Buffer cannot be negative')
      .nullable()
      .optional(),
    min_advance_booking_hours: z
      .number()
      .int('Minimum advance booking must be a whole number')
      .min(0, 'Minimum advance booking cannot be negative')
      .max(720, 'Minimum advance booking cannot exceed 720 hours')
      .nullable()
      .optional(),
    max_advance_booking_days: z
      .number()
      .int('Maximum advance booking must be a whole number')
      .min(0, 'Maximum advance booking cannot be negative')
      .max(365, 'Maximum advance booking cannot exceed 365 days')
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.min_advance_booking_hours == null || data.max_advance_booking_days == null) {
        return true
      }

      const minHours = data.min_advance_booking_hours
      const maxHours = data.max_advance_booking_days * 24
      return maxHours >= minHours
    },
    {
      message: 'Maximum advance booking must be greater than the minimum advance booking',
      path: ['max_advance_booking_days'],
    },
  )

export function extractFirstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid service data'
}
