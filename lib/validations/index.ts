/**
 * Centralized validation schemas barrel file
 * Exports all shared and domain-specific validation schemas from a single entry point
 *
 * Usage:
 *   import { loginSchema, bookingSchema, nameSchema } from '@/lib/validations'
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

// Auth validation schemas
export { loginSchema, signupSchema, type LoginInput, type SignupInput } from './auth'

// Booking validation schemas
export { bookingSchema, type BookingInput } from './booking'

// Customer appointment validation schemas
export { rescheduleSchema } from './customer/appointments'

// Customer favorites validation schemas
export { favoriteSchema } from './customer/favorites'

// Customer reviews validation schemas
export { reviewSchema } from './customer/reviews'
