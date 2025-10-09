import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import type { Appointment } from './analytics.types'

export async function getCustomerSegmentation(
  salonId: string,
  activeDays: number = 30,
  atRiskDays: number = 90,
  topN: number = 10
): Promise<{
  counts: { active: number; atRisk: number; churned: number }
  averageLTV: number
  medianLTV: number
  vip: Array<{ name: string; email?: string; totalSpent: number; visits: number }>
  frequencyBuckets: { one: number; twoToThree: number; fourToNine: number; tenPlus: number }
  aovBuckets: { under50: number; between50And100: number; between100And200: number; over200: number }
}> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select('customer_id, customer_name, customer_email, total_price, start_time, status')
    .eq('salon_id', salonId)

  if (error) throw error

  const appointments = (data || []) as Appointment[]

  type CustomerAgg = {
    name: string
    email?: string | null
    spent: number
    visits: number
    last: Date | null
  }

  const aggregates = new Map<string, CustomerAgg>()

  for (const appointment of appointments) {
    if (!appointment.customer_id) continue
    const current = aggregates.get(appointment.customer_id) || {
      name: appointment.customer_name || 'Customer',
      email: appointment.customer_email || undefined,
      spent: 0,
      visits: 0,
      last: null,
    }
    if (appointment.status === 'completed') {
      current.spent += appointment.total_price || 0
      current.visits += 1
      if (appointment.start_time) {
        const visitDate = new Date(appointment.start_time)
        if (!current.last || visitDate > current.last) {
          current.last = visitDate
        }
      }
    }
    aggregates.set(appointment.customer_id, current)
  }

  const ltvs = Array.from(aggregates.values()).map(customer => customer.spent)
  const averageLTV = ltvs.length ? ltvs.reduce((sum, value) => sum + value, 0) / ltvs.length : 0

  const sorted = ltvs.slice().sort((a, b) => a - b)
  const medianLTV = sorted.length
    ? (sorted.length % 2 === 1
      ? sorted[Math.floor((sorted.length - 1) / 2)]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
    : 0

  let active = 0
  let atRisk = 0
  let churned = 0
  const now = new Date()

  for (const customer of aggregates.values()) {
    if (!customer.last) continue
    const daysSinceVisit = Math.floor((now.getTime() - customer.last.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceVisit <= activeDays) active += 1
    else if (daysSinceVisit <= atRiskDays) atRisk += 1
    else churned += 1
  }

  let one = 0
  let twoToThree = 0
  let fourToNine = 0
  let tenPlus = 0
  for (const customer of aggregates.values()) {
    if (customer.visits === 1) one += 1
    else if (customer.visits <= 3) twoToThree += 1
    else if (customer.visits <= 9) fourToNine += 1
    else if (customer.visits >= 10) tenPlus += 1
  }

  let under50 = 0
  let between50And100 = 0
  let between100And200 = 0
  let over200 = 0
  for (const customer of aggregates.values()) {
    const aov = customer.visits ? customer.spent / customer.visits : 0
    if (aov < 50) under50 += 1
    else if (aov < 100) between50And100 += 1
    else if (aov < 200) between100And200 += 1
    else over200 += 1
  }

  const vip = Array.from(aggregates.values())
    .sort((a, b) => b.spent - a.spent)
    .slice(0, topN)
    .map(customer => ({
      name: customer.name,
      email: customer.email || undefined,
      totalSpent: customer.spent,
      visits: customer.visits,
    }))

  return {
    counts: { active, atRisk, churned },
    averageLTV,
    medianLTV,
    vip,
    frequencyBuckets: { one, twoToThree, fourToNine, tenPlus },
    aovBuckets: { under50, between50And100, between100And200, over200 },
  }
}
