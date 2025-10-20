/**
 * Application Configuration
 *
 * Business rules, booking config, pagination, validation, file uploads, etc.
 */

/**
 * Booking Configuration
 */
export const BOOKING_CONFIG = {
  // Minimum hours in advance to book
  MIN_ADVANCE_HOURS: 2,

  // Maximum days in advance to book
  MAX_ADVANCE_DAYS: 90,

  // Default appointment duration (minutes)
  DEFAULT_DURATION: 60,

  // Business hours
  BUSINESS_HOURS: {
    START: '09:00',
    END: '20:00',
  },

  // Time slot interval (minutes)
  SLOT_INTERVAL: 30,
} as const

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

/**
 * File Upload Limits
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_UPLOAD: 5,
} as const

/**
 * Validation Constraints
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  BIO_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 500,
} as const

/**
 * Date and Time Formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy', // Jan 15, 2025
  SHORT: 'MM/dd/yyyy', // 01/15/2025
  LONG: 'MMMM dd, yyyy', // January 15, 2025
  TIME: 'HH:mm', // 14:30
  TIME_12H: 'h:mm a', // 2:30 PM
  DATETIME: 'MMM dd, yyyy HH:mm', // Jan 15, 2025 14:30
} as const
