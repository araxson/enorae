import 'server-only'

import {
  authorizeStaffAccess,
  calculateDefaultCommission,
  toDateOnly,
} from './helpers'
import type { PayoutSchedule } from './types'

const DEFAULT_COMMISSION_RATE = 0.4
const MILLIS_IN_DAY = 24 * 60 * 60 * 1000

function isWithinSevenDays(target: Date, reference: Date) {
  return target.getTime() - reference.getTime() < 7 * MILLIS_IN_DAY
}

export async function getPayoutSchedule(
  staffId: string,
  months = 6,
): Promise<PayoutSchedule[]> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const payouts: PayoutSchedule[] = []
  const today = new Date()

  for (let index = 0; index < months; index += 1) {
    const periodEnd = new Date(today.getFullYear(), today.getMonth() - index, 0)
    const periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1)

    const { data, error } = await supabase
      .from('appointments')
      .select('total_price')
      .eq('staff_id', staffId)
      .eq('status', 'completed')
      .gte('start_time', periodStart.toISOString())
      .lte('start_time', periodEnd.toISOString())

    if (error) throw error

    const totalRevenue =
      (data as { total_price: number | null }[])?.reduce((sum, appointment) => sum + (appointment.total_price ?? 0), 0) ?? 0
    const commissionAmount = calculateDefaultCommission(
      totalRevenue,
      DEFAULT_COMMISSION_RATE,
    )

    const payoutDate = new Date(
      periodEnd.getFullYear(),
      periodEnd.getMonth() + 1,
      15,
    )
    const isPaid = payoutDate < today
    const isProcessing = !isPaid && isWithinSevenDays(payoutDate, today)

    payouts.push({
      period_start: toDateOnly(periodStart) ?? '',
      period_end: toDateOnly(periodEnd) ?? '',
      total_revenue: totalRevenue,
      commission_amount: commissionAmount,
      payout_status: isPaid
        ? 'paid'
        : isProcessing
          ? 'processing'
          : 'pending',
      payout_date: toDateOnly(payoutDate),
    })
  }

  return payouts
}

export async function exportCommissionReport(
  staffId: string,
  dateFrom: string,
  dateTo: string,
): Promise<string> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('start_time, service_names, customer_name, total_price')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)
    .order('start_time', { ascending: true })

  if (error) throw error

  type AppointmentExport = {
    start_time: string | null
    service_names: string[] | null
    customer_name: string | null
    total_price: number | null
  }

  const header =
    'Date,Time,Service,Customer,Revenue,Commission Rate,Commission Amount\n'

  const rows =
    (appointments as AppointmentExport[])?.map((appointment) => {
      const startTime = appointment.start_time
      const date = startTime
        ? new Date(startTime).toLocaleDateString()
        : 'N/A'
      const time = startTime
        ? new Date(startTime).toLocaleTimeString()
        : 'N/A'
      const service = Array.isArray(appointment.service_names)
        ? appointment.service_names.join(', ')
        : 'N/A'
      const customer = appointment.customer_name ?? 'N/A'
      const revenue = appointment.total_price ?? 0
      const commission = calculateDefaultCommission(
        revenue,
        DEFAULT_COMMISSION_RATE,
      )

      return `"${date}","${time}","${service}","${customer}",${revenue.toFixed(
        2,
      )},${(DEFAULT_COMMISSION_RATE * 100).toFixed(
        0,
      )}%,${commission.toFixed(2)}`
    }) ?? []

  return `${header}${rows.join('\n')}${rows.length ? '\n' : ''}`
}
