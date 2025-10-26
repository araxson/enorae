import 'server-only'

import { authorizeStaffAccess, toDateOnly } from '@/lib/utils/commission'
import type { PayoutSchedule } from './types'

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

    const { error } = await supabase
      .from('appointments_view')
      .select('id', { count: 'exact', head: true })
      .eq('staff_id', staffId)
      .eq('status', 'completed')
      .gte('start_time', periodStart.toISOString())
      .lte('start_time', periodEnd.toISOString())

    if (error) throw error

    const totalRevenue = 0
    const commissionAmount = 0

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
      payout_date: toDateOnly(payoutDate) ?? null,
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
    .from('appointments_view')
    .select('start_time, status')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)
    .order('start_time', { ascending: true })

  if (error) throw error

  type AppointmentExport = {
    start_time: string | null
    status: string | null
  }

  const header = 'Date,Time,Status\n'

  const rows =
    (appointments as AppointmentExport[])?.map((appointment) => {
      const startTime = appointment.start_time
      const date = startTime ? new Date(startTime).toLocaleDateString() : 'N/A'
      const time = startTime ? new Date(startTime).toLocaleTimeString() : 'N/A'
      const status = appointment.status ?? 'completed'

      return `"${date}","${time}","${status}"`
    }) ?? []

  return `${header}${rows.join('\n')}${rows.length ? '\n' : ''}`
}
