/**
 * Text Field Validation Schemas
 *
 * Common text field validations (name, title, description)
 */

import { z } from 'zod'

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
