import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Discount type enumeration
 */
export const discountTypeEnum = z.enum(['percentage', 'fixed_amount', 'free_service'])


/**
 * Coupon status enumeration
 */
export const couponStatusEnum = z.enum(['active', 'inactive', 'expired', 'depleted'])


/**
 * Coupon code validation
 * Allows letters, numbers, hyphens, and underscores
 */
const couponCodeRegex = /^[A-Z0-9_-]{3,50}$/

/**
 * Coupon creation/update schema
 * Validates coupon details including discount, validity, and restrictions
 */
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(50, 'Coupon code must be 50 characters or fewer')
    .regex(couponCodeRegex, 'Coupon code must be uppercase letters, numbers, hyphens, or underscores')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(3, 'Coupon name must be at least 3 characters').max(200, 'Name is too long'),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),
  discount_type: discountTypeEnum,
  discount_value: z.coerce
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100000, 'Discount value is too high'),
  max_discount_amount: z.coerce
    .number()
    .min(0, 'Max discount cannot be negative')
    .max(100000, 'Amount is too high')
    .optional(),
  min_purchase_amount: z.coerce
    .number()
    .min(0, 'Minimum purchase cannot be negative')
    .max(100000, 'Amount is too high')
    .optional(),
  valid_from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const validFrom = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // Allow creating coupons that started yesterday (timezone tolerance)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return validFrom >= yesterday
      },
      {
        message: 'Start date cannot be more than 1 day in the past',
      }
    ),
  valid_until: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  max_uses: z.coerce
    .number()
    .int('Max uses must be a whole number')
    .min(1, 'Must allow at least 1 use')
    .max(1000000, 'Max uses seems too high')
    .optional(),
  max_uses_per_customer: z.coerce
    .number()
    .int('Max uses per customer must be a whole number')
    .min(1, 'Must allow at least 1 use per customer')
    .max(1000, 'Max uses per customer seems too high')
    .optional(),
  status: couponStatusEnum.default('active'),
  is_single_use: z.boolean().default(false),
  is_combinable: z.boolean().default(false),
  applies_to_service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .max(100, 'Too many services selected')
    .optional(),
  excludes_service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .max(100, 'Too many services excluded')
    .optional(),
  applies_to_customer_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid customer ID'))
    .max(1000, 'Too many customers selected')
    .optional(),
  first_time_customers_only: z.boolean().default(false),
  minimum_appointment_duration: z.coerce
    .number()
    .int('Duration must be in whole minutes')
    .min(0, 'Duration cannot be negative')
    .max(480, 'Duration cannot exceed 8 hours')
    .optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // Valid until must be after valid from
    const from = new Date(data.valid_from)
    const until = new Date(data.valid_until)
    return until > from
  },
  {
    message: 'End date must be after start date',
    path: ['valid_until'],
  }
).refine(
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
).refine(
  (data) => {
    // If percentage discount, max_discount_amount should be set
    if (data.discount_type === 'percentage' && !data.max_discount_amount) {
      return false
    }
    return true
  },
  {
    message: 'Maximum discount amount is recommended for percentage discounts',
    path: ['max_discount_amount'],
  }
).refine(
  (data) => {
    // Cannot both apply to and exclude same services
    if (data.applies_to_service_ids && data.excludes_service_ids) {
      const applies = new Set(data.applies_to_service_ids)
      const excludes = new Set(data.excludes_service_ids)
      for (const id of excludes) {
        if (applies.has(id)) return false
      }
    }
    return true
  },
  {
    message: 'A service cannot be both included and excluded',
    path: ['excludes_service_ids'],
  }
)

/**
 * Bulk coupon generation schema
 * For generating multiple unique coupon codes at once
 */
export const bulkCouponGenerationSchema = z.object({
  name_prefix: z
    .string()
    .min(3, 'Name prefix must be at least 3 characters')
    .max(50, 'Name prefix is too long'),
  code_prefix: z
    .string()
    .min(2, 'Code prefix must be at least 2 characters')
    .max(10, 'Code prefix is too long')
    .regex(/^[A-Z0-9]+$/, 'Code prefix must be uppercase letters and numbers')
    .transform((val) => val.toUpperCase()),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Must generate at least 1 coupon')
    .max(1000, 'Cannot generate more than 1000 coupons at once'),
  discount_type: discountTypeEnum,
  discount_value: z.coerce.number().min(0, 'Discount cannot be negative'),
  valid_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  is_single_use: z.boolean().default(true),
})

/**
 * Coupon redemption schema
 * For validating and applying coupon codes at checkout
 */
export const couponRedemptionSchema = z.object({
  coupon_code: z
    .string()
    .min(3, 'Enter a valid coupon code')
    .max(50, 'Coupon code is too long')
    .transform((val) => val.toUpperCase()),
  customer_id: z.string().regex(UUID_REGEX, 'Invalid customer ID'),
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
  service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .min(1, 'At least one service is required'),
  subtotal_amount: z.coerce
    .number()
    .min(0, 'Subtotal cannot be negative')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
})

/**
 * Inferred TypeScript types from schemas
 */
export type CouponSchema = z.infer<typeof couponSchema>
export type BulkCouponGenerationSchema = z.infer<typeof bulkCouponGenerationSchema>
export type CouponRedemptionSchema = z.infer<typeof couponRedemptionSchema>
