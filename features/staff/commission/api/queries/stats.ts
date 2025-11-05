import 'server-only'

import type { AppointmentRow } from '../../api/types'
import { authorizeStaffAccess } from '@/features/staff/commission/utils'
import type { CommissionData, DailyEarnings } from '../../api/types'
import { createOperationLogger } from '@/lib/observability'

function sumRevenue(appointments: AppointmentRow[] | null | undefined) {
  return (
    appointments?.reduce(
      (sum, appointment) => sum + (appointment.total_price ?? 0),
      0,
    ) ?? 0
  )
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toEndOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function formatISO(date: Date) {
  return date.toISOString()
}

export async function getStaffCommission(
  staffId: string,
): Promise<CommissionData> {
  const logger = createOperationLogger('getStaffCommission', {})
  logger.start()

  const { supabase } = await authorizeStaffAccess(staffId)

  const now = new Date()

  const startOfDay = toStartOfDay(now)
  const endOfDay = toEndOfDay(now)

  const { data: todayAppointments, error: todayError } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_id, customer_id, staff_id, start_time, end_time, status, total_price, created_at')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', formatISO(startOfDay))
    .lte('start_time', formatISO(endOfDay))

  if (todayError) throw todayError

  const todayEarnings = sumRevenue(todayAppointments as AppointmentRow[])

  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const { data: weekAppointments, error: weekError } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_id, customer_id, staff_id, start_time, end_time, status, total_price, created_at')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', formatISO(startOfWeek))
    .lte('start_time', formatISO(endOfWeek))

  if (weekError) throw weekError

  const weekEarnings = sumRevenue(weekAppointments as AppointmentRow[])

  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1)
  const endOfMonth = new Date(
    startOfDay.getFullYear(),
    startOfDay.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  )

  const { data: monthAppointments, error: monthError } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_id, customer_id, staff_id, start_time, end_time, status, total_price, created_at')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', formatISO(startOfMonth))
    .lte('start_time', formatISO(endOfMonth))

  if (monthError) throw monthError

  const monthEarnings = sumRevenue(monthAppointments as AppointmentRow[])
  const totalAppointments = monthAppointments?.length ?? 0
  const avgPerAppointment =
    totalAppointments > 0 ? monthEarnings / totalAppointments : 0

  return {
    todayEarnings,
    weekEarnings,
    monthEarnings,
    totalAppointments,
    avgPerAppointment,
  }
}

export async function getDailyEarnings(
  staffId: string,
  days = 30,
): Promise<DailyEarnings[]> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: appointments, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_id, customer_id, staff_id, start_time, end_time, status, total_price, created_at')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', startDate.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error

  const earningsByDate = new Map<string, DailyEarnings>()

  appointments?.forEach((record) => {
    const appointment = record as AppointmentRow
    if (!appointment.start_time) return

    const dateStr = new Date(appointment.start_time).toISOString().split('T')[0]
    if (!dateStr) return
    const date = dateStr
    const existing = earningsByDate.get(date)

    const revenue = appointment.total_price ?? 0

    if (existing) {
      existing.earnings += revenue
      existing.appointments += 1
    } else {
      earningsByDate.set(date, {
        date,
        earnings: revenue,
        appointments: 1,
      })
    }
  })

  return Array.from(earningsByDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}
