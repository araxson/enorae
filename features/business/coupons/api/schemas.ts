import { z } from 'zod'

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Base schemas for reusability
export const couponCodeSchema = z
  .string()
  .min(3, 'Coupon code must be at least 3 characters')
  .max(20, 'Coupon code must be less than 20 characters')
  .regex(/^[A-Z0-9-_]+$/, 'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores')
  .transform((val) => val.toUpperCase().trim())

export const discountTypeSchema = z.enum(['percentage', 'fixed'])

export const discountValueSchema = (type: 'percentage' | 'fixed') =>
  z.coerce
    .number()
    .positive('Discount value must be greater than 0')
    .refine(
      (val) => {
        if (type === 'percentage') {
          return val > 0 && val <= 100
        }
        return val > 0
      },
      {
        message: type === 'percentage' ? 'Percentage must be between 1 and 100' : 'Fixed amount must be greater than 0',
      }
    )

export const futureDateSchema = z
  .string()
  .datetime('Invalid datetime format')
  .refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  )

export const dateRangeSchema = z
  .object({
    valid_from: z.string().datetime('Invalid start date format'),
    valid_until: z.string().datetime('Invalid end date format'),
  })
  .refine(
    (data) => new Date(data.valid_until) > new Date(data.valid_from),
    {
      message: 'End date must be after start date',
      path: ['valid_until'],
    }
  )

// Single coupon creation schema
export const createCouponSchema = z
  .object({
    salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
    code: couponCodeSchema,
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description must be less than 500 characters'),
    discount_type: discountTypeSchema,
    discount_value: z.coerce.number().positive(),
    min_purchase_amount: z.coerce.number().positive().nullable().optional(),
    max_discount_amount: z.coerce.number().positive().nullable().optional(),
    max_uses: z.coerce.number().int().positive().nullable().optional(),
    max_uses_per_customer: z.coerce.number().int().positive().nullable().optional(),
    valid_from: z.string().datetime(),
    valid_until: z.string().datetime(),
    is_active: z.coerce.boolean().default(true),
    applicable_services: z.array(z.string().regex(UUID_REGEX)).optional().default([]),
    applicable_customer_ids: z.array(z.string().regex(UUID_REGEX)).optional().default([]),
  })
  .refine(
    (data) => {
      // Validate discount value based on type
      if (data.discount_type === 'percentage') {
        return data.discount_value > 0 && data.discount_value <= 100
      }
      return data.discount_value > 0
    },
    {
      message: 'Percentage must be between 1 and 100, or fixed amount must be greater than 0',
      path: ['discount_value'],
    }
  )
  .refine(
    (data) => new Date(data.valid_until) > new Date(data.valid_from),
    {
      message: 'End date must be after start date',
      path: ['valid_until'],
    }
  )
  .refine(
    (data) => {
      // If max_discount_amount is set for percentage discount, it should be reasonable
      if (data.discount_type === 'percentage' && data.max_discount_amount !== null && data.max_discount_amount !== undefined) {
        return data.max_discount_amount > 0
      }
      return true
    },
    {
      message: 'Maximum discount amount must be greater than 0',
      path: ['max_discount_amount'],
    }
  )

// Bulk coupon generation schema
export const bulkGenerateCouponsSchema = z
  .object({
    salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
    prefix: z
      .string()
      .min(2, 'Prefix must be at least 2 characters')
      .max(6, 'Prefix must be less than 6 characters')
      .regex(/^[A-Z0-9]+$/, 'Prefix must contain only uppercase letters and numbers')
      .transform((val) => val.toUpperCase()),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description must be less than 500 characters'),
    discount_type: discountTypeSchema,
    discount_value: z.coerce.number().positive(),
    count: z.coerce
      .number()
      .int('Count must be a whole number')
      .min(1, 'Must generate at least 1 coupon')
      .max(100, 'Cannot generate more than 100 coupons at once'),
    valid_from: z.string().datetime(),
    valid_until: z.string().datetime(),
    is_active: z.coerce.boolean().default(true),
    min_purchase_amount: z.coerce.number().positive().nullable().optional(),
    max_discount_amount: z.coerce.number().positive().nullable().optional(),
  })
  .refine(
    (data) => {
      // Validate discount value based on type
      if (data.discount_type === 'percentage') {
        return data.discount_value > 0 && data.discount_value <= 100
      }
      return data.discount_value > 0
    },
    {
      message: 'Percentage must be between 1 and 100, or fixed amount must be greater than 0',
      path: ['discount_value'],
    }
  )
  .refine(
    (data) => new Date(data.valid_until) > new Date(data.valid_from),
    {
      message: 'End date must be after start date',
      path: ['valid_until'],
    }
  )

// Update coupon schema (partial fields allowed)
export const updateCouponSchema = createCouponSchema
  .partial()
  .extend({
    id: z.string().regex(UUID_REGEX, 'Invalid coupon ID'),
  })
  .required({ id: true })

// Toggle coupon status schema
export const toggleCouponStatusSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid coupon ID'),
  is_active: z.coerce.boolean(),
})

// Apply coupon schema (for customer usage)
export const applyCouponSchema = z.object({
  code: couponCodeSchema,
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  customer_id: z.string().regex(UUID_REGEX, 'Invalid customer ID'),
  purchase_amount: z.coerce.number().positive('Purchase amount must be greater than 0'),
  service_ids: z.array(z.string().regex(UUID_REGEX)).optional().default([]),
})

export type CreateCouponInput = z.infer<typeof createCouponSchema>
export type BulkGenerateCouponsInput = z.infer<typeof bulkGenerateCouponsSchema>
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>
export type ToggleCouponStatusInput = z.infer<typeof toggleCouponStatusSchema>
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>
