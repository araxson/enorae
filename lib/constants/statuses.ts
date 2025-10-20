/**
 * Status Enums and Constants
 *
 * Application-wide status definitions for appointments, staff, bookings, etc.
 */

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
