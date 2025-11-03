/**
 * Common Validation Schemas
 *
 * Centralized Zod schemas for frequently used validation patterns
 * Eliminates duplicate email, phone, URL, and other common validations
 *
 * Usage:
 * ```ts
 * import { emailSchema, phoneSchema } from '@/lib/validation/common-schemas'
 * import { z } from 'zod'
 *
 * const mySchema = z.object({
 *   email: emailSchema,
 *   phone: phoneSchema.optional(),
 * })
 * ```
 */

import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .toLowerCase()
  .trim()

/**
 * Optional email validation schema
 */
export const emailOptionalSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()
  .trim()
  .optional()

/**
 * Phone number validation schema (E.164 format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')

/**
 * Optional phone number validation schema
 */
export const phoneOptionalSchema = phoneSchema.optional()

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .min(1, 'URL is required')

/**
 * Optional URL validation schema
 */
export const urlOptionalSchema = z.string().url('Invalid URL format').optional()

/**
 * UUID validation schema
 */
export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format')
  .min(1, 'UUID is required')

/**
 * Optional UUID validation schema
 */
export const uuidOptionalSchema = z.string().uuid('Invalid UUID format').optional()

/**
 * Non-empty string validation
 */
export const nonEmptyStringSchema = z
  .string()
  .min(1, 'This field is required')
  .trim()

/**
 * Optional non-empty string validation
 */
export const optionalStringSchema = z.string().trim().optional()

/**
 * Slug validation schema (lowercase alphanumeric with hyphens)
 */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
  .min(1, 'Slug is required')
  .max(100, 'Slug must not exceed 100 characters')

/**
 * Password validation schema (minimum security requirements)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * Positive number validation
 */
export const positiveNumberSchema = z
  .number()
  .positive('Must be a positive number')
  .finite('Must be a finite number')

/**
 * Non-negative number validation
 */
export const nonNegativeNumberSchema = z
  .number()
  .nonnegative('Must be a non-negative number')
  .finite('Must be a finite number')

/**
 * Positive integer validation
 */
export const positiveIntegerSchema = z
  .number()
  .int('Must be an integer')
  .positive('Must be a positive integer')

/**
 * Date string validation (ISO 8601)
 */
export const dateStringSchema = z
  .string()
  .datetime({ message: 'Invalid date format' })

/**
 * Optional date string validation
 */
export const dateStringOptionalSchema = z
  .string()
  .datetime({ message: 'Invalid date format' })
  .optional()

/**
 * Percentage validation (0-100)
 */
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must not exceed 100')

/**
 * Price validation (positive number with 2 decimal places)
 */
export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .finite('Price must be finite')
  .multipleOf(0.01, 'Price must have at most 2 decimal places')

/**
 * Duration in minutes validation (positive integer)
 */
export const durationMinutesSchema = z
  .number()
  .int('Duration must be an integer')
  .positive('Duration must be positive')
  .max(1440, 'Duration cannot exceed 24 hours (1440 minutes)')

/**
 * Text area validation (max 1000 characters)
 */
export const textAreaSchema = z
  .string()
  .max(1000, 'Text must not exceed 1000 characters')
  .trim()

/**
 * Description validation (max 500 characters)
 */
export const descriptionSchema = z
  .string()
  .max(500, 'Description must not exceed 500 characters')
  .trim()

/**
 * Optional description validation
 */
export const descriptionOptionalSchema = z
  .string()
  .max(500, 'Description must not exceed 500 characters')
  .trim()
  .optional()

/**
 * Name validation (2-100 characters)
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .trim()

/**
 * Title validation (2-200 characters)
 */
export const titleSchema = z
  .string()
  .min(2, 'Title must be at least 2 characters')
  .max(200, 'Title must not exceed 200 characters')
  .trim()
