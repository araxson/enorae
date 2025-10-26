import { APPOINTMENT_STATUS_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'

/**
 * Re-export utilities from lib/utils for backward compatibility
 */
export { formatCurrency } from '@/lib/utils/formatting'
export { safeFormatDate } from '@/lib/utils/date-time'

export const appointmentStatusVariant = APPOINTMENT_STATUS_BADGE_VARIANT
