import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { TIME_CONVERSIONS, ANALYTICS_CONFIG } from '@/lib/config/constants'

type AppointmentSummary = {
  id: string
  customer_id: string
  start_time: string | null
  end_time?: string | null
  status?: string | null
}

type PaymentRecord = {
  appointment_id: string | null
  customer_id: string | null
  amount: number | null
  transaction_type: string | null
}

/**
 * Calculate Customer Lifetime Value (CLV)
 */
export async function calculateCustomerLifetimeValue(customerId: string) {
  const logger = createOperationLogger('calculateCustomerLifetimeValue', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all completed appointments for customer with total_price
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('id, start_time, end_time')
    .eq('customer_id', customerId)
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  const { data: payments, error: paymentsError } = await supabase
    .from('manual_transactions_view')
    .select('appointment_id, amount, transaction_type, customer_id')
    .eq('salon_id', salonId)
    .eq('customer_id', customerId)
    .eq('transaction_type', 'payment')

  if (paymentsError) throw paymentsError

  const paymentRows = (payments ?? []) as PaymentRecord[]
  const revenueByAppointment = new Map<string, number>()
  let uncategorizedRevenue = 0

  for (const payment of paymentRows) {
    const amount = Number(payment.amount ?? 0)
    if (!amount) continue
    if (payment.appointment_id) {
      revenueByAppointment.set(
        payment.appointment_id,
        (revenueByAppointment.get(payment.appointment_id) ?? 0) + amount
      )
    } else {
      uncategorizedRevenue += amount
    }
  }

  if (appointmentRows.length === 0) {
    return {
      totalRevenue: 0,
      averageOrderValue: 0,
      visitCount: 0,
      lifetimeValue: 0,
      avgDaysBetweenVisits: 0,
      projectedLTV: 0,
    }
  }

  // Calculate total revenue from actual appointment prices
  const visitCount = appointmentRows.length
  const totalRevenue =
    appointmentRows.reduce(
      (sum, apt) => sum + (revenueByAppointment.get(apt.id) ?? 0),
      0
    ) + uncategorizedRevenue
  const avgSpendPerVisit = visitCount > 0 ? totalRevenue / visitCount : 0

  // Calculate average days between visits
  let totalDaysBetweenVisits = 0
  for (let visitIndex = 1; visitIndex < appointmentRows.length; visitIndex++) {
    const previousVisitStart = appointmentRows[visitIndex - 1]?.start_time
    const currentVisitStart = appointmentRows[visitIndex]?.start_time
    if (!previousVisitStart || !currentVisitStart) continue
    const previousVisitDate = new Date(previousVisitStart)
    const currentVisitDate = new Date(currentVisitStart)
    const daysBetween = (currentVisitDate.getTime() - previousVisitDate.getTime()) / TIME_CONVERSIONS.MS_PER_DAY
    totalDaysBetweenVisits += daysBetween
  }
  const avgDaysBetweenVisits =
    appointmentRows.length > 1 ? totalDaysBetweenVisits / (appointmentRows.length - 1) : 0

  // Calculate customer tenure
  const firstVisitStart = appointmentRows[0]?.start_time
  const lastVisitStart = appointmentRows[appointmentRows.length - 1]?.start_time
  const firstVisitDate = firstVisitStart ? new Date(firstVisitStart) : new Date()
  const lastVisitDate = lastVisitStart ? new Date(lastVisitStart) : new Date()
  const tenureDays = (lastVisitDate.getTime() - firstVisitDate.getTime()) / TIME_CONVERSIONS.MS_PER_DAY

  // Project future value (simple model: visits per year * avg spend * projection period)
  const visitsPerYear = avgDaysBetweenVisits > 0
    ? ANALYTICS_CONFIG.DAYS_PER_YEAR / avgDaysBetweenVisits
    : visitCount
  const projectedLTV = visitsPerYear * avgSpendPerVisit * ANALYTICS_CONFIG.LTV_PROJECTION_YEARS

  return {
    totalRevenue,
    averageOrderValue: avgSpendPerVisit,
    visitCount,
    lifetimeValue: totalRevenue,
    avgDaysBetweenVisits: Math.round(avgDaysBetweenVisits),
    tenureDays: Math.round(tenureDays),
    projectedLTV: Math.round(projectedLTV),
  }
}
