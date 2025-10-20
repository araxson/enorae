import { z } from 'zod'

/**
 * Schema for short description
 * Limited to 200 characters for SEO and preview purposes
 */
const shortDescriptionSchema = z
  .string()
  .max(200, 'Short description must not exceed 200 characters')
  .optional()
  .nullable()

/**
 * Schema for full description
 * Limited to 2000 characters for detailed salon information
 */
const fullDescriptionSchema = z
  .string()
  .max(2000, 'Full description must not exceed 2000 characters')
  .optional()
  .nullable()

/**
 * Schema for welcome message
 * Limited to 500 characters
 */
const welcomeMessageSchema = z
  .string()
  .max(500, 'Welcome message must not exceed 500 characters')
  .optional()
  .nullable()

/**
 * Schema for cancellation policy
 * Limited to 1000 characters
 */
const cancellationPolicySchema = z
  .string()
  .max(1000, 'Cancellation policy must not exceed 1000 characters')
  .optional()
  .nullable()

/**
 * Schema for meta title (SEO)
 * Limited to 60 characters for optimal SEO
 */
const metaTitleSchema = z
  .string()
  .max(60, 'Meta title must not exceed 60 characters')
  .optional()
  .nullable()

/**
 * Schema for meta description (SEO)
 * Limited to 160 characters for optimal SEO
 */
const metaDescriptionSchema = z
  .string()
  .max(160, 'Meta description must not exceed 160 characters')
  .optional()
  .nullable()

/**
 * Schema for meta keywords (SEO)
 * Array of keywords, each limited to 50 characters, max 10 keywords
 */
const metaKeywordsSchema = z
  .array(z.string().max(50, 'Each keyword must not exceed 50 characters'))
  .max(10, 'Maximum 10 keywords allowed')
  .optional()
  .nullable()

/**
 * Schema for arrays of strings (amenities, specialties, etc.)
 * Each item limited to 100 characters, max 20 items
 */
const stringArraySchema = z
  .array(z.string().max(100, 'Each item must not exceed 100 characters'))
  .max(20, 'Maximum 20 items allowed')
  .optional()
  .nullable()

/**
 * Schema for updating salon description
 * Validates all description and metadata fields
 */
export const updateSalonDescriptionSchema = z.object({
  salonId: z.string().uuid('Invalid salon ID format'),
  short_description: shortDescriptionSchema,
  full_description: fullDescriptionSchema,
  welcome_message: welcomeMessageSchema,
  cancellation_policy: cancellationPolicySchema,
  meta_title: metaTitleSchema,
  meta_description: metaDescriptionSchema,
  meta_keywords: metaKeywordsSchema,
  amenities: stringArraySchema,
  specialties: stringArraySchema,
  payment_methods: stringArraySchema,
  languages_spoken: stringArraySchema,
  awards: stringArraySchema,
  certifications: stringArraySchema,
})

/**
 * Type exports for mutations
 */
export type UpdateSalonDescriptionInput = z.infer<typeof updateSalonDescriptionSchema>
