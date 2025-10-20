import { z } from 'zod'

/**
 * Shared validation schemas and utilities for consistent validation across the app
 * CLAUDE.md: Layer 6 - Validation standardization
 */

// UUID Validation
export const uuidSchema = z.string().uuid('Invalid ID format')

// Common String Schemas
export const nameSchema = z.string().trim().min(1, 'Name is required').max(200, 'Name must be 200 characters or less')

export const descriptionSchema = z.string().trim().max(2000, 'Description must be 2000 characters or less').optional()

export const emailSchema = z.string().trim().email('Invalid email address').toLowerCase()

export const phoneSchema = z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional()

export const urlSchema = z.string().trim().url('Invalid URL format')

// Common Number Schemas
export const positiveIntSchema = z.number().int().min(0, 'Must be a positive number')

export const positiveNumberSchema = z.number().min(0, 'Must be a positive number')

export const priceSchema = z.number().min(0, 'Price cannot be negative').multipleOf(0.01, 'Price can have at most 2 decimal places')

export const percentageSchema = z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100')

// Date Schemas
export const isoDateSchema = z.string().refine(
  (val) => !Number.isNaN(Date.parse(val)),
  'Must be a valid ISO-8601 date'
)

export const futureDateSchema = z.string().refine(
  (val) => new Date(val) > new Date(),
  'Date must be in the future'
)

// Common Constants
export const MAX_NAME_LENGTH = 200
export const MAX_DESCRIPTION_LENGTH = 2000
export const MAX_SLUG_LENGTH = 200

// Slug Schema
export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(MAX_SLUG_LENGTH, `Slug must be ${MAX_SLUG_LENGTH} characters or less`)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

// Color Schemas
export const hexColorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color (e.g., #FF0000)')

export const brandColorsSchema = z.object({
  primary: hexColorSchema.optional(),
  secondary: hexColorSchema.optional(),
  accent: hexColorSchema.optional(),
}).optional()
