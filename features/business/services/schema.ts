import { z } from 'zod'

export const serviceFormSchema = z.object({
  name: z.string()
    .min(1, 'Service name is required')
    .max(120, 'Service name must be 120 characters or fewer')
    .trim(),
  description: z.string()
    .max(2000, 'Description must be 2000 characters or fewer')
    .trim()
    .optional()
    .or(z.literal('')),
  category_id: z.string().uuid('Invalid category').optional().nullable(),
  is_active: z.boolean().default(true),
  is_bookable: z.boolean().default(true),
  is_featured: z.boolean().default(false),
})

export const servicePricingSchema = z.object({
  base_price: z.coerce.number()
    .min(0, 'Base price must be positive')
    .finite('Base price must be a valid number'),
  sale_price: z.coerce.number()
    .min(0, 'Sale price cannot be negative')
    .finite('Sale price must be a valid number')
    .nullable()
    .optional(),
  currency_code: z.string()
    .length(3, 'Currency code must be a 3-letter ISO code')
    .transform((code) => code.toUpperCase())
    .default('USD'),
  is_taxable: z.boolean().default(false),
  tax_rate: z.coerce.number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%')
    .nullable()
    .optional(),
  commission_rate: z.coerce.number()
    .min(0, 'Commission rate cannot be negative')
    .max(100, 'Commission rate cannot exceed 100%')
    .nullable()
    .optional(),
  cost: z.coerce.number()
    .min(0, 'Cost cannot be negative')
    .nullable()
    .optional(),
}).refine(
  (data) => !data.sale_price || data.sale_price <= data.base_price,
  {
    message: 'Sale price cannot exceed the base price',
    path: ['sale_price'],
  }
)

export const serviceBookingRulesSchema = z.object({
  duration_minutes: z.coerce.number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least one minute')
    .max(480, 'Duration cannot exceed 8 hours'),
  buffer_minutes: z.coerce.number()
    .int('Buffer must be a whole number')
    .min(0, 'Buffer cannot be negative')
    .max(120, 'Buffer cannot exceed 2 hours')
    .nullable()
    .optional()
    .default(0),
  min_advance_booking_hours: z.coerce.number()
    .int('Minimum advance booking must be a whole number')
    .min(0, 'Minimum advance booking cannot be negative')
    .max(720, 'Minimum advance booking cannot exceed 720 hours')
    .nullable()
    .optional(),
  max_advance_booking_days: z.coerce.number()
    .int('Maximum advance booking must be a whole number')
    .min(0, 'Maximum advance booking cannot be negative')
    .max(365, 'Maximum advance booking cannot exceed 365 days')
    .nullable()
    .optional(),
}).refine(
  (data) => {
    if (!data.min_advance_booking_hours || !data.max_advance_booking_days) {
      return true
    }
    const minHours = data.min_advance_booking_hours
    const maxHours = data.max_advance_booking_days * 24
    return maxHours >= minHours
  },
  {
    message: 'Maximum advance booking must be greater than minimum advance booking',
    path: ['max_advance_booking_days'],
  }
)

export const createServiceSchema = z.object({
  salon_id: z.string().uuid('Invalid salon ID'),
  service: serviceFormSchema,
  pricing: servicePricingSchema,
  booking_rules: serviceBookingRulesSchema,
})

export const updateServiceSchema = z.object({
  service_id: z.string().uuid('Invalid service ID'),
  service: serviceFormSchema.partial().optional(),
  pricing: z.object({
    base_price: z.coerce.number().min(0).finite().optional(),
    sale_price: z.coerce.number().min(0).finite().nullable().optional(),
    currency_code: z.string().length(3).transform((code) => code.toUpperCase()).optional(),
    is_taxable: z.boolean().optional(),
    tax_rate: z.coerce.number().min(0).max(100).nullable().optional(),
    commission_rate: z.coerce.number().min(0).max(100).nullable().optional(),
    cost: z.coerce.number().min(0).nullable().optional(),
  }).optional(),
  booking_rules: z.object({
    duration_minutes: z.coerce.number().int().min(1).max(480).optional(),
    buffer_minutes: z.coerce.number().int().min(0).max(120).nullable().optional(),
    min_advance_booking_hours: z.coerce.number().int().min(0).max(720).nullable().optional(),
    max_advance_booking_days: z.coerce.number().int().min(0).max(365).nullable().optional(),
  }).optional(),
})

export const servicesSchema = z.object({})
export type ServicesSchema = z.infer<typeof servicesSchema>
export type ServiceFormSchema = z.infer<typeof serviceFormSchema>
export type ServicePricingSchema = z.infer<typeof servicePricingSchema>
export type ServiceBookingRulesSchema = z.infer<typeof serviceBookingRulesSchema>
export type CreateServiceSchema = z.infer<typeof createServiceSchema>
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>
