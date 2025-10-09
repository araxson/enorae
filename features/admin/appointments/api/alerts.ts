import { differenceInHours, differenceInMinutes, parseISO } from 'date-fns'
import { randomUUID } from 'node:crypto'
import type {
  AppointmentRow,
  AppointmentSnapshot,
  DisputeCandidate,
  FraudAlert,
} from './types'

const HOURS_IN_DAY = 24

export const buildNoShowRecords = (rows: AppointmentRow[]): AppointmentSnapshot['noShows'] => {
  const noShows = rows.filter((row) => row.status === 'no_show')
  const total = noShows.length
  const rate = rows.length ? total / rows.length : 0

  const recent = noShows
    .sort((a, b) => (b.start_time || '').localeCompare(a.start_time || ''))
    .slice(0, 10)
    .map((row) => ({
      id: row.id ?? randomUUID(),
      salonName: row.salon_name,
      customerName: row.customer_name,
      staffName: row.staff_name,
      startTime: row.start_time,
      totalPrice: row.total_price,
    }))

  return { count: total, rate, recent }
}

export const buildFraudAlerts = (rows: AppointmentRow[]): FraudAlert[] => {
  const alerts: FraudAlert[] = []
  const customerCounts = new Map<string, { cancellations: number; noShows: number; appointments: string[] }>()
  const staffAppointments = new Map<string, AppointmentRow[]>()

  rows.forEach((row) => {
    const customerKey = row.customer_id ?? row.customer_email ?? 'anonymous'
    const status = row.status ?? 'pending'

    const customer = customerCounts.get(customerKey) ?? { cancellations: 0, noShows: 0, appointments: [] }
    if (status === 'cancelled') customer.cancellations += 1
    if (status === 'no_show') customer.noShows += 1
    customer.appointments.push(row.id ?? randomUUID())
    customerCounts.set(customerKey, customer)

    if (row.staff_id) {
      const list = staffAppointments.get(row.staff_id) ?? []
      list.push(row)
      staffAppointments.set(row.staff_id, list)
    }

    if (status === 'cancelled' && row.total_price && row.total_price > 250) {
      alerts.push({
        id: `high-value-${row.id}`,
        type: 'high_value_cancellation',
        score: Math.min(1, row.total_price / 500),
        summary: `${row.customer_name || 'Customer'} cancelled a high-value booking ($${row.total_price.toFixed(0)})`,
        relatedAppointmentIds: [row.id ?? randomUUID()],
        customerId: row.customer_id,
        salonId: row.salon_id,
      })
    }

    if (status === 'cancelled' && row.start_time && row.updated_at) {
      const start = parseISO(row.start_time)
      const updated = parseISO(row.updated_at)
      const hoursBefore = differenceInHours(start, updated)
      if (hoursBefore >= 0 && hoursBefore < 2) {
        alerts.push({
          id: `rapid-cancel-${row.id}`,
          type: 'rapid_cancellation',
          score: Math.min(1, (2 - hoursBefore) / 2),
          summary: `${row.customer_name || 'Customer'} cancelled within ${hoursBefore.toFixed(1)}h of start`,
          relatedAppointmentIds: [row.id ?? randomUUID()],
          customerId: row.customer_id,
          salonId: row.salon_id,
        })
      }
    }
  })

  customerCounts.forEach((value, key) => {
    if (value.noShows >= 3 || value.cancellations >= 4) {
      alerts.push({
        id: `repeat-${key}`,
        type: 'repeated_no_show',
        score: Math.min(1, (value.noShows + value.cancellations) / 6),
        summary: `Customer ${key} has ${value.noShows} no-shows and ${value.cancellations} cancellations`,
        relatedAppointmentIds: value.appointments,
        customerId: key,
      })
    }
  })

  staffAppointments.forEach((list, staffId) => {
    const sorted = list
      .filter((row) => row.start_time)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))

    for (let i = 0; i < sorted.length - 1; i += 1) {
      const current = sorted[i]
      const next = sorted[i + 1]
      if (!current.start_time || !next.start_time) continue
      const diff = differenceInMinutes(parseISO(next.start_time), parseISO(current.start_time))
      if (diff >= 0 && diff < 45) {
        alerts.push({
          id: `double-booking-${staffId}-${current.id}`,
          type: 'double_booking_risk',
          score: Math.min(1, (45 - diff) / 45),
          summary: `${current.staff_name || 'Staff'} has back-to-back appointments (${diff} mins apart)`,
          relatedAppointmentIds: [current.id ?? randomUUID(), next.id ?? randomUUID()],
          salonId: current.salon_id,
        })
      }
    }
  })

  return alerts
}

export const buildDisputeCandidates = (rows: AppointmentRow[]): DisputeCandidate[] => {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * HOURS_IN_DAY * 60 * 60 * 1000)

  return rows
    .filter((row) =>
      (row.status === 'cancelled' || row.status === 'no_show') &&
      row.start_time &&
      parseISO(row.start_time) >= sevenDaysAgo &&
      (row.total_price ?? 0) > 100
    )
    .map((row) => {
      const start = parseISO(row.start_time as string)
      const updated = row.updated_at ? parseISO(row.updated_at) : undefined
      const hoursBefore = updated ? differenceInHours(start, updated) : null

      const isSameDay = hoursBefore !== null && hoursBefore <= 24
      const reason = row.status === 'no_show'
        ? 'No-show on high-value booking'
        : isSameDay
          ? 'Same-day cancellation on premium booking'
          : 'High-value appointment cancellation'

      const recommendedAction = row.status === 'no_show'
        ? 'Contact customer, review penalty policy, and re-engage salon'
        : 'Review cancellation reason, consider partial refund, notify finance'

      return {
        appointmentId: row.id ?? randomUUID(),
        customerName: row.customer_name,
        salonName: row.salon_name,
        status: 'review',
        amount: row.total_price,
        reason,
        recommendedAction,
      }
    })
}
