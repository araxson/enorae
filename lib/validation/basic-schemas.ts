/**
 * Basic Validation Schemas
 *
 * Common string format validations (email, phone, URL, UUID, etc.)
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
 * Optional phone number validation
 */
export const phoneOptionalSchema = phoneSchema.optional()

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .min(1, 'URL is required')
  .trim()

/**
 * Optional URL validation
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
 * Optional UUID validation
 */
export const uuidOptionalSchema = z.string().uuid('Invalid UUID format').optional()

/**
 * Non-empty string validation
 */
export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, 'This field is required')

/**
 * Optional string with trimming
 */
export const optionalStringSchema = z.string().trim().optional()

/**
 * Slug validation (lowercase alphanumeric with hyphens)
 */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
  .min(1, 'Slug is required')

/**
 * Password validation (min 8 chars, complexity requirements)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
