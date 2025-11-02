import { z } from 'zod'

/**
 * Salon description schema
 * Validates salon description, tagline, and marketing content
 */
export const salonDescriptionSchema = z.object({
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters to help customers find you')
    .max(2000, 'Description must be 2000 characters or fewer')
    .refine(
      (val) => {
        // Ensure meaningful content (not just spaces/punctuation)
        const meaningfulChars = val.replace(/[\s.,;!?-]/g, '').length
        return meaningfulChars >= 40
      },
      {
        message: 'Please provide a more detailed description with meaningful content',
      }
    ),
  short_description: z
    .string()
    .min(20, 'Short description must be at least 20 characters')
    .max(200, 'Short description must be 200 characters or fewer')
    .optional(),
  tagline: z
    .string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(100, 'Tagline must be 100 characters or fewer')
    .optional(),
  specialties: z
    .array(z.string().min(2, 'Specialty must be at least 2 characters').max(50, 'Specialty is too long'))
    .max(10, 'Maximum 10 specialties allowed')
    .optional(),
  amenities: z
    .array(z.string().min(2, 'Amenity must be at least 2 characters').max(50, 'Amenity is too long'))
    .max(20, 'Maximum 20 amenities allowed')
    .optional(),
  languages_spoken: z
    .array(z.string().length(2, 'Language code must be 2 letters (e.g., en, es)'))
    .max(10, 'Maximum 10 languages allowed')
    .optional(),
  parking_info: z.string().max(500, 'Parking info must be 500 characters or fewer').optional(),
  accessibility_features: z
    .array(z.string().min(3, 'Feature must be at least 3 characters').max(100, 'Feature is too long'))
    .max(15, 'Maximum 15 accessibility features allowed')
    .optional(),
  website_url: z
    .string()
    .url('Enter a valid website URL')
    .max(200, 'URL is too long')
    .optional()
    .or(z.literal('')),
  facebook_url: z
    .string()
    .url('Enter a valid Facebook URL')
    .refine((url) => url.includes('facebook.com'), {
      message: 'Must be a valid Facebook URL',
    })
    .optional()
    .or(z.literal('')),
  instagram_handle: z
    .string()
    .regex(/^@?[A-Za-z0-9_.]+$/, 'Enter a valid Instagram handle')
    .max(30, 'Instagram handle is too long')
    .transform((val) => (val.startsWith('@') ? val : `@${val}`))
    .optional()
    .or(z.literal('')),
  twitter_handle: z
    .string()
    .regex(/^@?[A-Za-z0-9_]+$/, 'Enter a valid Twitter handle')
    .max(15, 'Twitter handle is too long')
    .transform((val) => (val.startsWith('@') ? val : `@${val}`))
    .optional()
    .or(z.literal('')),
})

/**
 * Salon branding schema
 * Validates brand colors, logos, and visual identity
 */
export const salonBrandingSchema = z.object({
  primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a valid hex color (e.g., #FF5733)')
    .optional(),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a valid hex color (e.g., #FF5733)')
    .optional(),
  logo_url: z.string().url('Enter a valid URL for your logo').max(500, 'URL is too long').optional(),
  cover_image_url: z.string().url('Enter a valid URL for your cover image').max(500, 'URL is too long').optional(),
})

/**
 * Salon business info schema
 * Validates business registration and legal information
 */
export const salonBusinessInfoSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters').max(200, 'Business name is too long'),
  business_type: z.enum(['sole_proprietor', 'partnership', 'llc', 'corporation', 'other']),
  registration_number: z.string().max(100, 'Registration number is too long').optional(),
  tax_id: z.string().max(50, 'Tax ID is too long').optional(),
  license_number: z.string().max(100, 'License number is too long').optional(),
  year_established: z.coerce
    .number()
    .int('Year must be a whole number')
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional(),
  employees_count: z.coerce
    .number()
    .int('Employee count must be a whole number')
    .min(1, 'Must have at least 1 employee')
    .max(1000, 'Employee count seems too high')
    .optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type SalonDescriptionSchema = z.infer<typeof salonDescriptionSchema>
export type SalonBrandingSchema = z.infer<typeof salonBrandingSchema>
export type SalonBusinessInfoSchema = z.infer<typeof salonBusinessInfoSchema>
