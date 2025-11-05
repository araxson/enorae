import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

type AppointmentSummary = {
  id: string
  customer_id: string
  start_time: string | null
  status?: string | null
}

/**
 * Get customer retention metrics
 */
export async function getRetentionMetrics(
  startDate: Date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date()
) {
  const logger = createOperationLogger('getRetentionMetrics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get customers who had appointments in the period
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRows.length === 0) {
    return {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      retentionRate: 0,
      churnRate: 0,
    }
  }

  // Group appointments by customer
  const customerVisits = new Map<string, Date[]>()
  for (const apt of appointmentRows) {
    if (!apt.start_time) continue
    if (!customerVisits.has(apt.customer_id)) {
      customerVisits.set(apt.customer_id, [])
    }
    const visits = customerVisits.get(apt.customer_id)
    if (visits) {
      visits.push(new Date(apt.start_time))
    }
  }

  // Calculate metrics
  const totalCustomers = customerVisits.size
  const newCustomers = Array.from(customerVisits.values()).filter(
    (visits) => visits.length === 1
  ).length
  const returningCustomers = totalCustomers - newCustomers

  const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0
  const churnRate = 100 - retentionRate

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    retentionRate: Math.round(retentionRate * 10) / 10,
    churnRate: Math.round(churnRate * 10) / 10,
  }
}
