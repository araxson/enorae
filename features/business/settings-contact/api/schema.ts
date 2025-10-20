import { z } from 'zod'

/**
 * Schema for phone number validation
 * Basic format check for phone numbers
 */
const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
  .min(7, 'Phone number must be at least 7 characters')
  .max(20, 'Phone number must not exceed 20 characters')
  .optional()
  .nullable()

/**
 * Schema for email validation
 */
const emailSchema = z.string().email('Invalid email address').optional().nullable()

/**
 * Schema for URL validation
 */
const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(500, 'URL must not exceed 500 characters')
  .optional()
  .nullable()

/**
 * Schema for social media username (WhatsApp, Telegram)
 */
const usernameSchema = z
  .string()
  .min(1, 'Username cannot be empty')
  .max(100, 'Username must not exceed 100 characters')
  .optional()
  .nullable()

/**
 * Schema for hours display text
 */
const hoursDisplaySchema = z
  .string()
  .max(200, 'Hours display text must not exceed 200 characters')
  .optional()
  .nullable()

/**
 * Schema for updating salon contact details
 * Validates all contact information fields
 */
export const updateSalonContactDetailsSchema = z.object({
  salonId: z.string().uuid('Invalid salon ID format'),
  primary_phone: phoneSchema,
  secondary_phone: phoneSchema,
  primary_email: emailSchema,
  booking_email: emailSchema,
  website_url: urlSchema,
  booking_url: urlSchema,
  facebook_url: urlSchema,
  instagram_url: urlSchema,
  twitter_url: urlSchema,
  tiktok_url: urlSchema,
  linkedin_url: urlSchema,
  youtube_url: urlSchema,
  whatsapp_number: phoneSchema,
  telegram_username: usernameSchema,
  hours_display_text: hoursDisplaySchema,
})

/**
 * Type exports for mutations
 */
export type UpdateSalonContactDetailsInput = z.infer<typeof updateSalonContactDetailsSchema>
