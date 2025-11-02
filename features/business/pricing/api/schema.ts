import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Pricing rule type enumeration
 */
export const pricingRuleTypeEnum = z.enum(['peak_hours', 'off_peak', 'seasonal', 'loyalty', 'group', 'custom'])


/**
 * Discount type enumeration
 */
export const discountTypeEnum = z.enum(['percentage', 'fixed_amount', 'tiered'])


/**
 * Day of week validation
 */
const dayOfWeekSchema = z.coerce.number().int().min(0, 'Sunday is 0').max(6, 'Saturday is 6')

/**
 * Dynamic pricing rule schema
 * For creating rules that adjust pricing based on various factors
 */
export const pricingRuleSchema = z.object({
  name: z.string().min(3, 'Rule name must be at least 3 characters').max(200, 'Name is too long'),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),
  rule_type: pricingRuleTypeEnum,
  is_active: z.boolean().default(true),
  priority: z.coerce
    .number()
    .int('Priority must be a whole number')
    .min(0, 'Priority cannot be negative')
    .max(100, 'Priority too high')
    .default(50),

  // Service and staff applicability
  applies_to_service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .max(100, 'Too many services')
    .optional(),
  applies_to_staff_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid staff ID'))
    .max(100, 'Too many staff members')
    .optional(),

  // Time-based conditions
  valid_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  days_of_week: z.array(dayOfWeekSchema).max(7, 'Maximum 7 days').optional(),
  time_ranges: z
    .array(
      z.object({
        start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
        end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
      })
    )
    .max(10, 'Maximum 10 time ranges')
    .optional(),

  // Pricing adjustments
  adjustment_type: discountTypeEnum,
  adjustment_value: z.coerce
    .number()
    .min(-100, 'Adjustment cannot decrease by more than 100%')
    .max(1000, 'Adjustment seems too high'),
  max_discount_amount: z.coerce
    .number()
    .min(0, 'Max discount cannot be negative')
    .max(99999.99, 'Amount is too high')
    .optional(),
  min_booking_value: z.coerce
    .number()
    .min(0, 'Minimum booking value cannot be negative')
    .max(99999.99, 'Amount is too high')
    .optional(),

  // Conditions
  requires_advance_booking_days: z.coerce.number().int().min(0).max(365).optional(),
  requires_min_services: z.coerce.number().int().min(1).max(20).optional(),
  is_first_time_customer_only: z.boolean().default(false),
  is_combinable_with_other_rules: z.boolean().default(false),

  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // If valid_until is set, it must be after valid_from
    if (data.valid_from && data.valid_until) {
      const from = new Date(data.valid_from)
      const until = new Date(data.valid_until)
      return until > from
    }
    return true
  },
  {
    message: 'Valid until date must be after valid from date',
    path: ['valid_until'],
  }
).refine(
  (data) => {
    // Percentage adjustments must be within reasonable bounds
    if (data.adjustment_type === 'percentage') {
      return Math.abs(data.adjustment_value) <= 100
    }
    return true
  },
  {
    message: 'Percentage adjustment must be between -100% and 100%',
    path: ['adjustment_value'],
  }
)

/**
 * Tiered pricing schema
 * For services with different price levels based on staff seniority, time, etc.
 */
export const tieredPricingSchema = z.object({
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  tier_name: z.string().min(2, 'Tier name must be at least 2 characters').max(100, 'Name is too long'),
  tier_level: z.coerce
    .number()
    .int('Tier level must be a whole number')
    .min(1, 'Tier level must be at least 1')
    .max(10, 'Tier level too high'),
  price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  staff_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid staff ID'))
    .max(50, 'Too many staff members')
    .optional(),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

/**
 * Seasonal pricing schema
 * For seasonal price adjustments (holidays, peak seasons, etc.)
 */
export const seasonalPricingSchema = z.object({
  name: z.string().min(3, 'Season name must be at least 3 characters').max(200, 'Name is too long'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  adjustment_percentage: z.coerce
    .number()
    .min(-50, 'Cannot decrease by more than 50%')
    .max(200, 'Cannot increase by more than 200%'),
  applies_to_service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .max(100, 'Too many services')
    .optional(),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
  is_active: z.boolean().default(true),
}).refine(
  (data) => {
    // End date must be after start date
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    return end > start
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
)

/**
 * Group booking discount schema
 * For discounts on multiple services or people
 */
export const groupDiscountSchema = z.object({
  name: z.string().min(3, 'Discount name must be at least 3 characters').max(200, 'Name is too long'),
  min_services: z.coerce
    .number()
    .int('Must be a whole number')
    .min(2, 'Minimum 2 services for group discount')
    .max(20, 'Maximum 20 services'),
  discount_type: discountTypeEnum,
  discount_value: z.coerce.number().min(0, 'Discount cannot be negative'),
  max_discount_amount: z.coerce.number().min(0).max(99999.99).optional(),
  applies_to_service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .max(100, 'Too many services')
    .optional(),
  is_active: z.boolean().default(true),
}).refine(
  (data) => {
    // Percentage discounts must be <= 100
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      return false
    }
    return true
  },
  {
    message: 'Percentage discount cannot exceed 100%',
    path: ['discount_value'],
  }
)

/**
 * Inferred TypeScript types from schemas
 */
export type PricingRuleSchema = z.infer<typeof pricingRuleSchema>
export type TieredPricingSchema = z.infer<typeof tieredPricingSchema>
export type SeasonalPricingSchema = z.infer<typeof seasonalPricingSchema>
export type GroupDiscountSchema = z.infer<typeof groupDiscountSchema>
