/**
 * Appointment Status Configuration
 *
 * Centralized configuration for appointment status display across all dashboards
 * Provides consistent badge variants, labels, and descriptions
 */

export const APPOINTMENT_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    description: 'Awaiting confirmation',
    icon: 'clock',
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'default' as const,
    description: 'Confirmed and scheduled',
    icon: 'check-circle',
  },
  checked_in: {
    label: 'Checked In',
    variant: 'default' as const,
    description: 'Customer has arrived',
    icon: 'user-check',
  },
  in_progress: {
    label: 'In Progress',
    variant: 'default' as const,
    description: 'Service is being performed',
    icon: 'activity',
  },
  completed: {
    label: 'Completed',
    variant: 'outline' as const,
    description: 'Service completed successfully',
    icon: 'check-circle-2',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive' as const,
    description: 'Appointment was cancelled',
    icon: 'x-circle',
  },
  no_show: {
    label: 'No Show',
    variant: 'destructive' as const,
    description: 'Customer did not arrive',
    icon: 'user-x',
  },
} as const

export type AppointmentStatusKey = keyof typeof APPOINTMENT_STATUS_CONFIG
export type BadgeVariant = typeof APPOINTMENT_STATUS_CONFIG[AppointmentStatusKey]['variant']

/**
 * Get status configuration for a given status
 * Falls back to 'pending' if status is null/undefined or unknown
 */
export function getStatusConfig(status: string | null | undefined): typeof APPOINTMENT_STATUS_CONFIG[AppointmentStatusKey] {
  if (!status) {
    return APPOINTMENT_STATUS_CONFIG.pending
  }

  const statusKey = status as AppointmentStatusKey
  return APPOINTMENT_STATUS_CONFIG[statusKey] || APPOINTMENT_STATUS_CONFIG.pending
}

/**
 * Get badge variant for a given status
 * Convenience function for components that only need the variant
 */
export function getStatusVariant(status: string | null | undefined): BadgeVariant {
  return getStatusConfig(status).variant
}

/**
 * Get human-readable label for a given status
 */
export function getStatusLabel(status: string | null | undefined): string {
  return getStatusConfig(status).label
}

/**
 * Check if a status is a final state (cannot be changed)
 */
export function isFinalStatus(status: string | null | undefined): boolean {
  if (!status) return false
  return ['completed', 'cancelled', 'no_show'].includes(status)
}

/**
 * Check if a status is active (appointment is ongoing or upcoming)
 */
export function isActiveStatus(status: string | null | undefined): boolean {
  if (!status) return false
  return ['pending', 'confirmed', 'checked_in', 'in_progress'].includes(status)
}

/**
 * Get all valid status transitions for a given current status
 * Returns array of statuses that the appointment can transition to
 */
export function getValidTransitions(currentStatus: string | null | undefined): AppointmentStatusKey[] {
  if (!currentStatus) return ['confirmed', 'cancelled']

  const transitions: Record<AppointmentStatusKey, AppointmentStatusKey[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['checked_in', 'cancelled', 'no_show'],
    checked_in: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [], // Final state
    cancelled: [], // Final state
    no_show: [], // Final state
  }

  const statusKey = currentStatus as AppointmentStatusKey
  return transitions[statusKey] || []
}

/**
 * Check if a status transition is valid
 */
export function isValidTransition(
  currentStatus: string | null | undefined,
  newStatus: string
): boolean {
  const validTransitions = getValidTransitions(currentStatus)
  return validTransitions.includes(newStatus as AppointmentStatusKey)
}
