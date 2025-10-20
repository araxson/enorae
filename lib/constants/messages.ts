/**
 * User-Facing Messages
 *
 * Error messages, success messages, and notifications
 */

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
