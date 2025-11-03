import 'server-only'
import { parseISO } from 'date-fns'
import type { AppointmentRow } from '@/features/admin/appointments/api/types'
import type {
  AppointmentStatusTotals,
  AppointmentSnapshot,
} from '@/features/admin/appointments/api/types'

export const ZERO_TOTALS: AppointmentStatusTotals = {
  total: 0,
  completed: 0,
  cancelled: 0,
  noShow: 0,
  inProgress: 0,
  upcoming: 0,
}

export const buildStatusTotals = (rows: AppointmentRow[]): AppointmentStatusTotals => {
  if (!rows.length) return { ...ZERO_TOTALS }

  return rows.reduce((acc, row) => {
    acc.total += 1
    const status = row['status'] ?? 'pending'

    if (status === 'completed') acc.completed += 1
    else if (status === 'cancelled') acc.cancelled += 1
    else if (status === 'no_show') acc.noShow += 1
    else if (status === 'in_progress' || status === 'checked_in') acc.inProgress += 1

    const startTime = row['start_time'] ? parseISO(row['start_time']) : null
    if (startTime && startTime > new Date() && !['cancelled', 'no_show'].includes(status)) {
      acc.upcoming += 1
    }

    return acc
  }, { ...ZERO_TOTALS })
}

export const calculatePerformanceMetrics = (
  totals: AppointmentStatusTotals,
  rows: AppointmentRow[],
): AppointmentSnapshot['performance'] => {
  const completedRevenue = rows
    .filter((row) => row['status'] === 'completed' && typeof row['total_price'] === 'number')
    .reduce((acc, row) => acc + (row['total_price'] || 0), 0)

  const averageDuration = rows.length
    ? rows.reduce((acc, row) => acc + (row['duration_minutes'] || 0), 0) / rows.length
    : 0

  const completionRate = totals.total ? totals.completed / totals.total : 0
  const cancellationRate = totals.total ? totals.cancelled / totals.total : 0
  const noShowRate = totals.total ? totals.noShow / totals.total : 0
  const averageTicket = totals.completed ? completedRevenue / totals.completed : 0

  return {
    completionRate,
    cancellationRate,
    noShowRate,
    averageDuration,
    totalRevenue: completedRevenue,
    averageTicket,
  }
}
