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

// Basic format schemas
export * from './basic-schemas'

// Number and date schemas
export * from './number-schemas'

// Text field schemas
export * from './text-schemas'
