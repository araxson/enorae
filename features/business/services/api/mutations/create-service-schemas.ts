import { z } from 'zod'
import { BUSINESS_THRESHOLDS } from '@/lib/config/constants'

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Service name is required')
    .max(BUSINESS_THRESHOLDS.SERVICE_NAME_MAX_LENGTH, `Service name must be ${BUSINESS_THRESHOLDS.SERVICE_NAME_MAX_LENGTH} characters or fewer`),
  description: z
    .string()
    .trim()
    .max(BUSINESS_THRESHOLDS.SERVICE_DESCRIPTION_MAX_LENGTH, `Description must be ${BUSINESS_THRESHOLDS.SERVICE_DESCRIPTION_MAX_LENGTH} characters or fewer`)
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
      .length(BUSINESS_THRESHOLDS.CURRENCY_CODE_LENGTH, `Currency code must be a ${BUSINESS_THRESHOLDS.CURRENCY_CODE_LENGTH}-letter ISO code`)
      .transform((code) => code.toUpperCase()),
    is_taxable: z.boolean().optional(),
    tax_rate: z
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_TAX_RATE_PERCENT, `Tax rate cannot exceed ${BUSINESS_THRESHOLDS.MAX_TAX_RATE_PERCENT}%`)
      .nullable()
      .optional(),
    commission_rate: z
      .number()
      .min(0, 'Commission rate cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_COMMISSION_RATE_PERCENT, `Commission rate cannot exceed ${BUSINESS_THRESHOLDS.MAX_COMMISSION_RATE_PERCENT}%`)
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
      .max(BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_HOURS, `Minimum advance booking cannot exceed ${BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_HOURS} hours`)
      .nullable()
      .optional(),
    max_advance_booking_days: z
      .number()
      .int('Maximum advance booking must be a whole number')
      .min(0, 'Maximum advance booking cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_DAYS, `Maximum advance booking cannot exceed ${BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_DAYS} days`)
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.min_advance_booking_hours == null || data.max_advance_booking_days == null) {
        return true
      }

      const minHours = data.min_advance_booking_hours
      const maxHours = data.max_advance_booking_days * BUSINESS_THRESHOLDS.HOURS_IN_DAY
      return maxHours >= minHours
    },
    {
      message: 'Maximum advance booking must be greater than the minimum advance booking',
      path: ['max_advance_booking_days'],
    },
  )
