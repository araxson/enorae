import 'server-only'
import { differenceInHours, differenceInMinutes, parseISO } from 'date-fns'
import { randomUUID } from 'node:crypto'
import type { AppointmentRow } from '@/features/admin/appointments/api/types'
import type {
  FraudAlert,
  DisputeCandidate,
} from '@/features/admin/appointments/api/types'

const HOURS_IN_DAY = 24
const MINUTES_PER_HOUR = 60
const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const HIGH_VALUE_CANCELLATION_THRESHOLD = 250
const HIGH_VALUE_CANCELLATION_MAX_SCORE = 500
const RAPID_CANCELLATION_HOURS_THRESHOLD = 2
const NO_SHOW_ALERT_THRESHOLD = 3
const CANCELLATION_ALERT_THRESHOLD = 4
const FRAUD_SCORE_DIVISOR = 6
const DOUBLE_BOOKING_MINUTES_THRESHOLD = 45
const DISPUTE_DAYS_LOOKBACK = 7
const DISPUTE_AMOUNT_THRESHOLD = 100
const SAME_DAY_HOURS_THRESHOLD = 24

export const buildFraudAlerts = (rows: AppointmentRow[]): FraudAlert[] => {
  const alerts: FraudAlert[] = []
  const customerCounts = new Map<string, { cancellations: number; noShows: number; appointments: string[] }>()
  const staffAppointments = new Map<string, AppointmentRow[]>()

  rows.forEach((row) => {
    const customerKey = row['customer_id'] ?? row['customer_email'] ?? 'anonymous'
    const status = row.status ?? 'pending'

    const customer = customerCounts.get(customerKey) ?? { cancellations: 0, noShows: 0, appointments: [] }
    if (status === 'cancelled') customer.cancellations += 1
    if (status === 'no_show') customer.noShows += 1
    customer.appointments.push(row['id'] ?? randomUUID())
    customerCounts.set(customerKey, customer)

    if (row['staff_id']) {
      const list = staffAppointments.get(row['staff_id']) ?? []
      list.push(row)
      staffAppointments.set(row['staff_id'], list)
    }

    const totalPrice = row['total_price']
    if (status === 'cancelled' && totalPrice && totalPrice > HIGH_VALUE_CANCELLATION_THRESHOLD) {
      const MAX_FRAUD_SCORE = 1
      const CURRENCY_DECIMAL_PLACES = 0
      alerts.push({
        id: `high-value-${row['id']}`,
        type: 'high_value_cancellation',
        score: Math.min(MAX_FRAUD_SCORE, totalPrice / HIGH_VALUE_CANCELLATION_MAX_SCORE),
        summary: `${row['customer_name'] || 'Customer'} cancelled a high-value booking ($${totalPrice.toFixed(CURRENCY_DECIMAL_PLACES)})`,
        relatedAppointmentIds: [row['id'] ?? randomUUID()],
        customerId: row['customer_id'],
        salonId: row['salon_id'],
      })
    }

    const startTime = row['start_time']
    const updatedAt = row['updated_at']
    if (status === 'cancelled' && startTime && updatedAt) {
      const start = parseISO(startTime)
      const updated = parseISO(updatedAt)
      const hoursBefore = differenceInHours(start, updated)
      const MIN_HOURS_BEFORE = 0
      const MAX_FRAUD_SCORE = 1
      const HOURS_DECIMAL_PLACES = 1
      if (hoursBefore >= MIN_HOURS_BEFORE && hoursBefore < RAPID_CANCELLATION_HOURS_THRESHOLD) {
        alerts.push({
          id: `rapid-cancel-${row['id']}`,
          type: 'rapid_cancellation',
          score: Math.min(MAX_FRAUD_SCORE, (RAPID_CANCELLATION_HOURS_THRESHOLD - hoursBefore) / RAPID_CANCELLATION_HOURS_THRESHOLD),
          summary: `${row['customer_name'] || 'Customer'} cancelled within ${hoursBefore.toFixed(HOURS_DECIMAL_PLACES)}h of start`,
          relatedAppointmentIds: [row['id'] ?? randomUUID()],
          customerId: row['customer_id'],
          salonId: row['salon_id'],
        })
      }
    }
  })

  customerCounts.forEach((value, key) => {
    if (value.noShows >= NO_SHOW_ALERT_THRESHOLD || value.cancellations >= CANCELLATION_ALERT_THRESHOLD) {
      const MAX_FRAUD_SCORE = 1
      alerts.push({
        id: `repeat-${key}`,
        type: 'repeated_no_show',
        score: Math.min(MAX_FRAUD_SCORE, (value.noShows + value.cancellations) / FRAUD_SCORE_DIVISOR),
        summary: `Customer ${key} has ${value.noShows} no-shows and ${value.cancellations} cancellations`,
        relatedAppointmentIds: value.appointments,
        customerId: key,
      })
    }
  })

  staffAppointments.forEach((list, staffId) => {
    const sorted = list
      .filter((row) => row['start_time'])
      .sort((a, b) => (a['start_time'] || '').localeCompare(b['start_time'] || ''))

    for (let i = 0; i < sorted.length - 1; i += 1) {
      const current = sorted[i]
      const next = sorted[i + 1]
      if (!current || !next) continue
      const currentStartTime = current['start_time']
      const nextStartTime = next['start_time']
      if (!currentStartTime || !nextStartTime) continue
      const diff = differenceInMinutes(parseISO(nextStartTime), parseISO(currentStartTime))
      const MIN_DIFF = 0
      const MAX_FRAUD_SCORE = 1
      if (diff >= MIN_DIFF && diff < DOUBLE_BOOKING_MINUTES_THRESHOLD) {
        alerts.push({
          id: `double-booking-${staffId}-${current['id']}`,
          type: 'double_booking_risk',
          score: Math.min(MAX_FRAUD_SCORE, (DOUBLE_BOOKING_MINUTES_THRESHOLD - diff) / DOUBLE_BOOKING_MINUTES_THRESHOLD),
          summary: `${current['staff_name'] || 'Staff'} has back-to-back appointments (${diff} mins apart)`,
          relatedAppointmentIds: [current['id'] ?? randomUUID(), next['id'] ?? randomUUID()],
          salonId: current['salon_id'],
        })
      }
    }
  })

  return alerts
}

export const buildDisputeCandidates = (rows: AppointmentRow[]): DisputeCandidate[] => {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - DISPUTE_DAYS_LOOKBACK * HOURS_IN_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)

  const DEFAULT_PRICE = 0

  return rows
    .filter((row) => {
      const startTime = row['start_time']
      return (row.status === 'cancelled' || row.status === 'no_show') &&
        startTime &&
        parseISO(startTime) >= sevenDaysAgo &&
        (row['total_price'] ?? DEFAULT_PRICE) > DISPUTE_AMOUNT_THRESHOLD
    })
    .map((row) => {
      const startTime = row['start_time'] as string
      const updatedAt = row['updated_at']
      const start = parseISO(startTime)
      const updated = updatedAt ? parseISO(updatedAt) : undefined
      const hoursBefore = updated ? differenceInHours(start, updated) : null

      const isSameDay = hoursBefore !== null && hoursBefore <= SAME_DAY_HOURS_THRESHOLD
      const reason = row.status === 'no_show'
        ? 'No-show on high-value booking'
        : isSameDay
          ? 'Same-day cancellation on premium booking'
          : 'High-value appointment cancellation'

      const recommendedAction = row.status === 'no_show'
        ? 'Contact customer, review penalty policy, and re-engage salon'
        : 'Review cancellation reason, consider partial refund, notify finance'

      return {
        appointmentId: row['id'] ?? randomUUID(),
        customerName: row['customer_name'],
        salonName: row['salon_name'],
        status: 'review',
        amount: row['total_price'],
        reason,
        recommendedAction,
      }
    })
}
