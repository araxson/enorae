import { z } from 'zod'

export const couponSchema = z.object({
  code: z.string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code must be less than 20 characters')
    .regex(/^[A-Z0-9-_]+$/, 'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores')
    .transform((val) => val.toUpperCase()),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('', 'Description must be a valid string')),
  discount_type: z.enum(['percentage', 'fixed'], 'Discount type must be either percentage or fixed'),
  discount_value: z.coerce.number()
    .min(0, 'Discount value must be positive')
    .finite('Discount value must be a valid number'),
  min_purchase_amount: z.coerce.number()
    .min(0, 'Minimum purchase amount cannot be negative')
    .nullable()
    .optional(),
  max_discount_amount: z.coerce.number()
    .min(0, 'Maximum discount amount cannot be negative')
    .nullable()
    .optional(),
  max_uses: z.coerce.number()
    .int('Maximum uses must be a whole number')
    .min(1, 'Maximum uses must be at least 1')
    .nullable()
    .optional(),
  max_uses_per_customer: z.coerce.number()
    .int('Maximum uses per customer must be a whole number')
    .min(1, 'Maximum uses per customer must be at least 1')
    .nullable()
    .optional(),
  valid_from: z.string()
    .datetime('Invalid start date format')
    .optional(),
  valid_until: z.string()
    .datetime('Invalid end date format')
    .optional(),
  is_active: z.boolean().default(true),
  applicable_services: z.array(z.string().uuid('Invalid service ID')).default([]),
  applicable_customer_ids: z.array(z.string().uuid('Invalid customer ID')).default([]),
}).superRefine((data, ctx) => {
  // Validate percentage discounts
  if (data.discount_type === 'percentage') {
    if (data.discount_value > 100) {
      ctx.addIssue({
        code: 'custom',
        message: 'Percentage discount cannot exceed 100%',
        path: ['discount_value'],
      })
    }
    if (!data.max_discount_amount) {
      ctx.addIssue({
        code: 'custom',
        message: 'Maximum discount amount is required for percentage discounts',
        path: ['max_discount_amount'],
      })
    }
  }

  // Validate date range
  if (data.valid_from && data.valid_until) {
    const from = new Date(data.valid_from)
    const until = new Date(data.valid_until)
    if (until <= from) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be after start date',
        path: ['valid_until'],
      })
    }
  }

  // Validate max uses per customer doesn't exceed max uses
  if (data.max_uses && data.max_uses_per_customer && data.max_uses_per_customer > data.max_uses) {
    ctx.addIssue({
      code: 'custom',
      message: 'Max uses per customer cannot exceed total max uses',
      path: ['max_uses_per_customer'],
    })
  }
})

export const bulkCouponSchema = z.object({
  prefix: z.string()
    .min(2, 'Prefix must be at least 2 characters')
    .max(10, 'Prefix must be less than 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Prefix must contain only uppercase letters and numbers')
    .transform((val) => val.toUpperCase()),
  count: z.coerce.number()
    .int('Count must be a whole number')
    .min(1, 'Count must be at least 1')
    .max(1000, 'Cannot generate more than 1000 coupons at once'),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().min(0),
  valid_from: z.string().datetime().optional(),
  valid_until: z.string().datetime().optional(),
})

export const couponsSchema = z.object({})
export type CouponsSchema = z.infer<typeof couponsSchema>
export type CouponSchema = z.infer<typeof couponSchema>
export type BulkCouponSchema = z.infer<typeof bulkCouponSchema>
