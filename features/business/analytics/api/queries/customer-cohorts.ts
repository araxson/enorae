import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { Appointment } from '@/features/business/analytics/api/analytics.types'

export type CustomerCohort = {
  cohort: string
  size: number
  retention: number[]
}

export async function getCustomerCohorts(
  salonId: string,
  months: number = 6
): Promise<CustomerCohort[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const today = new Date()
  const start = new Date(today)
  start.setMonth(start.getMonth() - (months + 6))
  const startDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)).toISOString().split('T')[0]
  const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).toISOString().split('T')[0]

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select('customer_id, status, start_time')
    .eq('salon_id', salonId)
    .gte('start_time', startDate)
    .lte('start_time', endDate)

  if (error) throw error

  const appointments = (data || []) as Appointment[]

  const toMonthIndex = (date: Date) => date.getUTCFullYear() * 12 + date.getUTCMonth()
  const toCohortLabel = (index: number) => {
    const year = Math.floor(index / 12)
    const month = index % 12
    return `${year}-${String(month + 1).padStart(2, '0')}`
  }

  const customerFirstMonth = new Map<string, number>()
  const customerMonths = new Map<string, Set<number>>()

  for (const appointment of appointments) {
    if (!appointment.customer_id || !appointment.start_time) continue

    const monthIndex = toMonthIndex(new Date(appointment.start_time))

    if (appointment.status === 'completed') {
      const months = customerMonths.get(appointment.customer_id) || new Set<number>()
      months.add(monthIndex)
      customerMonths.set(appointment.customer_id, months)

      const existing = customerFirstMonth.get(appointment.customer_id)
      if (existing === undefined || monthIndex < existing) {
        customerFirstMonth.set(appointment.customer_id, monthIndex)
      }
    }
  }

  const cohorts: CustomerCohort[] = []
  const endMonth = toMonthIndex(new Date(endDate))

  for (let offset = months - 1; offset >= 0; offset--) {
    const cohortMonth = endMonth - offset
    const cohortMembers = Array.from(customerFirstMonth.entries())
      .filter(([, firstMonth]) => firstMonth === cohortMonth)
      .map(([customerId]) => customerId)

    const size = cohortMembers.length
    const retention: number[] = []

    for (let monthOffset = 0; monthOffset < months; monthOffset++) {
      if (size === 0) {
        retention.push(0)
        continue
      }

      const targetMonth = cohortMonth + monthOffset
      let retained = 0
      for (const customerId of cohortMembers) {
        const monthsVisited = customerMonths.get(customerId)
        if (monthsVisited && monthsVisited.has(targetMonth)) {
          retained += 1
        }
      }
      retention.push((retained / size) * 100)
    }

    cohorts.push({ cohort: toCohortLabel(cohortMonth), size, retention })
  }

  return cohorts
}
