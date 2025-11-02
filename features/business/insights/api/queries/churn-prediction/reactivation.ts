import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

type AppointmentSummary = {
  customer_id?: string
  start_time: string | null
}

type ProfileSummary = {
  id: string
  full_name: string | null
  email?: string | null
}

/**
 * Get customer reactivation opportunities
 */
export async function getReactivationOpportunities() {
  const logger = createOperationLogger('getReactivationOpportunities', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get customers with last visit between 90-365 days ago (churned but recoverable)
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, start_time')
    .eq('salon_id', salonId || '')
    .eq('status', 'completed')
    .gte(
      'start_time',
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    )
    .lte(
      'start_time',
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    )

  if (error) throw error

  const appointmentRecords = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRecords.length === 0) {
    return {
      totalOpportunities: 0,
      customers: [],
    }
  }

  // Find customers with their last visit in this range
  const customerLastVisit = new Map<string, Date>()
  for (const apt of appointmentRecords) {
    if (!apt.start_time || !apt.customer_id) continue
    const visitDate = new Date(apt.start_time)
    if (
      !customerLastVisit.has(apt.customer_id) ||
      visitDate > customerLastVisit.get(apt.customer_id)!
    ) {
      customerLastVisit.set(apt.customer_id, visitDate)
    }
  }

  // Get profiles
  const customerIds = Array.from(customerLastVisit.keys())
  const { data: profiles, error: profileError } = await supabase
    .from('profiles_view')
    .select('id, full_name, email')
    .in('id', customerIds)

  if (profileError) throw profileError

  const profileRecords = (profiles ?? []) as Array<ProfileSummary>

  const now = new Date()
  const customers = customerIds.map((customerId) => {
    const lastVisit = customerLastVisit.get(customerId)!
    const profile = profileRecords.find((p) => p.id === customerId)
    const daysSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)

    return {
      id: customerId,
      name: profile?.full_name || 'Unknown',
      email: profile?.email || '',
      daysSinceLastVisit: Math.round(daysSinceLastVisit),
      lastVisit: lastVisit.toISOString(),
    }
  })

  return {
    totalOpportunities: customers.length,
    customers: customers.sort((a, b) => a.daysSinceLastVisit - b.daysSinceLastVisit),
  }
}
