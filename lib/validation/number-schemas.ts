/**
 * Number Validation Schemas
 *
 * Common number and date validations
 */

import { z } from 'zod'

/**
 * Positive number validation
 */
export const positiveNumberSchema = z
  .number()
  .positive('Must be a positive number')
  .finite('Must be a finite number')

/**
 * Non-negative number validation (includes zero)
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
  .datetime('Invalid date format')

/**
 * Optional date string validation
 */
export const dateStringOptionalSchema = z
  .string()
  .datetime('Invalid date format')
  .optional()

/**
 * Percentage validation (0-100)
 */
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must not exceed 100')

/**
 * Price validation (in cents, positive integer)
 */
export const priceSchema = z
  .number()
  .int('Price must be an integer (in cents)')
  .nonnegative('Price must be non-negative')
  .finite('Price must be a finite number')

/**
 * Duration in minutes validation (positive integer)
 */
export const durationMinutesSchema = z
  .number()
  .int('Duration must be an integer')
  .positive('Duration must be positive')
  .max(1440, 'Duration must not exceed 24 hours (1440 minutes)')
