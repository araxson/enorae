import { format } from 'date-fns'
import { APPOINTMENT_STATUS_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number | null | undefined): string =>
  formatter.format(value ?? 0)

/**
 * Safely format a date string with error handling
 * @param dateStr - ISO date string from database
 * @param formatStr - date-fns format string
 * @param fallback - fallback value if parsing fails
 * @returns formatted date string or fallback
 */
export const safeFormatDate = (
  dateStr: string | null | undefined,
  formatStr: string,
  fallback = 'N/A'
): string => {
  if (!dateStr) return fallback

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return fallback
    return format(date, formatStr)
  } catch {
    return fallback
  }
}

export const appointmentStatusVariant = APPOINTMENT_STATUS_BADGE_VARIANT
