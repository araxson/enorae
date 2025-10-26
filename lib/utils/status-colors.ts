/**
 * Status badge color mapping utilities
 * Provides consistent status color mapping across the application
 */

/**
 * Badge variant type for shadcn/ui Badge component
 */
export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

/**
 * Get badge variant for appointment status
 */
export function getAppointmentStatusColor(
  status: string | null
): BadgeVariant {
  switch (status) {
    case 'completed':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'confirmed':
      return 'outline'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

/**
 * Get badge variant for general status strings
 * More generic version for other use cases
 */
export function getStatusColor(
  status: string | null,
  options?: {
    successStates?: string[]
    warningStates?: string[]
    errorStates?: string[]
  }
): BadgeVariant {
  if (!status) return 'outline'

  const {
    successStates = ['completed', 'active', 'confirmed', 'approved'],
    warningStates = ['in_progress', 'pending', 'processing'],
    errorStates = ['cancelled', 'rejected', 'failed', 'error'],
  } = options || {}

  if (successStates.includes(status.toLowerCase())) return 'default'
  if (warningStates.includes(status.toLowerCase())) return 'secondary'
  if (errorStates.includes(status.toLowerCase())) return 'destructive'

  return 'outline'
}
