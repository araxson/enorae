import 'server-only'

import { z } from 'zod'
import { STRING_LIMITS } from '@/lib/config/constants'

/**
 * Shared validation utilities for admin operations
 * Centralizes common validation patterns across all admin features
 */

// UUID validation
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const UUID_SCHEMA = z.string().regex(UUID_REGEX, 'Invalid ID format')

// Reason field validation (for audit trails)
export const REASON_SCHEMA = z
  .string()
  .trim()
  .min(20, 'Reason must be at least 20 characters for audit trail')
  .max(STRING_LIMITS.REASON, 'Reason must not exceed 500 characters')

// Optional reason (with fallback)
export const OPTIONAL_REASON_SCHEMA = z.string().trim().max(STRING_LIMITS.REASON).default('No reason provided')

// Email validation
export const EMAIL_SCHEMA = z.string().email('Invalid email format')

// Username validation
export const USERNAME_SCHEMA = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')

// Duration validation (for suspensions, bans)
export const DURATION_DAYS_SCHEMA = z
  .number()
  .int('Duration must be a whole number')
  .min(1, 'Duration must be at least 1 day')
  .max(365, 'Duration cannot exceed 365 days')

// Note/comment validation
export const NOTE_SCHEMA = z.string().trim().max(STRING_LIMITS.DESCRIPTION, 'Note must not exceed 1000 characters').optional()

// Confirmation token validation
export const CONFIRMATION_TOKEN_SCHEMA = UUID_SCHEMA

// Boolean acknowledgment (for critical actions)
export const ACKNOWLEDGMENT_SCHEMA = z.literal(true, 'You must acknowledge this action')

// Bulk operation limits
export const BULK_IDS_SCHEMA = z
  .array(UUID_SCHEMA)
  .min(1, 'At least one ID is required')
  .max(100, 'Cannot process more than 100 items at once')

// Common response types
export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Helper to create standardized validation errors
 */
export function createValidationError(field: string, message: string): ActionResponse {
  return {
    success: false,
    error: `${field}: ${message}`,
  }
}

/**
 * Helper to create standardized success responses
 */
export function createSuccessResponse<T>(data: T): ActionResponse<T> {
  return {
    success: true,
    data,
  }
}

/**
 * Helper to validate and parse form data with Zod
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ActionResponse<T> {
  const result = schema.safeParse(data)

  if (!result.success) {
    const firstError = result.error.issues[0]
    return {
      success: false,
      error: firstError?.message ?? 'Validation failed',
    }
  }

  return createSuccessResponse(result.data)
}
