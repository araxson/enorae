/**
 * Centralized validation schemas barrel file
 * Exports all shared validation schemas from a single entry point
 *
 * Usage:
 *   import { nameSchema, emailSchema } from '@/lib/validations'
 *
 * Note: Domain-specific schemas (auth, booking) are now located in their
 * respective feature folders (features/auth/*, features/customer/booking/*)
 */

// Shared validation schemas (primitives, common patterns)
export {
  uuidSchema,
  nameSchema,
  descriptionSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  positiveIntSchema,
  positiveNumberSchema,
  priceSchema,
  percentageSchema,
  isoDateSchema,
  futureDateSchema,
  slugSchema,
  hexColorSchema,
  brandColorsSchema,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_SLUG_LENGTH,
} from './shared'
