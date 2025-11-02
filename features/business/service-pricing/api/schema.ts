import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Pricing type enumeration
 */
export const pricingTypeEnum = z.enum(['fixed', 'variable', 'tiered'])


/**
 * Service pricing schema
 * Validates pricing information for salon services
 */
export const servicePricingSchema = z.object({
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  base_price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  min_price: z.coerce
    .number()
    .min(0, 'Minimum price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),
  max_price: z.coerce
    .number()
    .min(0, 'Maximum price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., USD, EUR)').default('USD'),
  pricing_type: pricingTypeEnum.default('fixed'),
  is_active: z.boolean().default(true),
}).refine(
  (data) => {
    // If min_price and max_price are set, min must be less than max
    if (data.min_price !== undefined && data.max_price !== undefined) {
      return data.min_price <= data.max_price
    }
    return true
  },
  {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['min_price'],
  }
).refine(
  (data) => {
    // If variable or tiered pricing, min and max are required
    if (data.pricing_type === 'variable' || data.pricing_type === 'tiered') {
      return data.min_price !== undefined && data.max_price !== undefined
    }
    return true
  },
  {
    message: 'Variable and tiered pricing requires minimum and maximum prices',
    path: ['pricing_type'],
  }
)

/**
 * Bulk pricing update schema
 * For updating multiple service prices at once
 */
export const bulkPricingUpdateSchema = z.object({
  service_ids: z.array(z.string().regex(UUID_REGEX, 'Invalid service ID')).min(1, 'Select at least one service'),
  price_adjustment: z.coerce
    .number()
    .min(-100, 'Cannot decrease by more than 100%')
    .max(1000, 'Cannot increase by more than 1000%'),
  adjustment_type: z.enum(['percentage', 'fixed']),
  })


/**
 * Service pricing tier schema
 * For tiered pricing structures (e.g., junior/senior stylists)
 */
export const pricingTierSchema = z.object({
  service_id: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  tier_name: z.string().min(1, 'Tier name is required').max(100, 'Tier name is too long'),
  tier_price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .max(99999.99, 'Price is too high')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  tier_order: z.coerce.number().int('Order must be a whole number').min(1, 'Order must be at least 1'),
  is_default: z.boolean().default(false),
})

/**
 * Inferred TypeScript types from schemas
 */
export type ServicePricingSchema = z.infer<typeof servicePricingSchema>
export type BulkPricingUpdateSchema = z.infer<typeof bulkPricingUpdateSchema>
export type PricingTierSchema = z.infer<typeof pricingTierSchema>
