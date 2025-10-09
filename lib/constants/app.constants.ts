import { env } from '@/lib/env'

/**
 * Application Constants
 *
 * Centralized constants for the Enorae application.
 * Import from this file to maintain consistency across the app.
 */

/**
 * Application Metadata
 */
export const APP_NAME = 'Enorae'
export const APP_DESCRIPTION = 'Modern salon booking platform with role-based portals for customers, staff, business owners, and platform administrators.'
export const APP_URL = env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_SITE_URL

/**
 * Application Version
 */
export const APP_VERSION = '1.0.0'

/**
 * Social Media Links
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/enorae',
  facebook: 'https://facebook.com/enorae',
  instagram: 'https://instagram.com/enorae',
  linkedin: 'https://linkedin.com/company/enorae',
} as const

/**
 * Contact Information
 */
export const CONTACT_EMAIL = 'hello@enorae.com'
export const SUPPORT_EMAIL = 'support@enorae.com'

/**
 * Appointment Statuses
 */
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const

/**
 * Staff Status
 */
export const STAFF_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
} as const

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

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  BOOKING_CONFIRMED: 'Your appointment has been confirmed.',
} as const

/**
 * Navigation Links
 */
export const NAV_LINKS = {
  CUSTOMER: [
    { href: '/salons', label: 'Browse Salons' },
    { href: '/profile', label: 'My Profile' },
  ],
  BUSINESS: [
    { href: '/business', label: 'Dashboard' },
    { href: '/business/appointments', label: 'Appointments' },
    { href: '/business/staff', label: 'Staff' },
    { href: '/business/services', label: 'Services' },
  ],
  STAFF: [
    { href: '/staff', label: 'My Schedule' },
    { href: '/staff/appointments', label: 'Appointments' },
  ],
  ADMIN: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/salons', label: 'Salons' },
    { href: '/admin/users', label: 'Users' },
  ],
} as const
