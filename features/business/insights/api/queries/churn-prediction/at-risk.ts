import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

type AppointmentSummary = {
  customer_id?: string
  start_time: string | null
  status: string | null
}

type ProfileSummary = {
  id: string
  full_name: string | null
  email?: string | null
  phone?: string | null
}

/**
 * Get customers at risk of churning
 */
export async function getAtRiskCustomers(limit: number = 20) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get recent completed appointments
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId || '')
    .eq('status', 'completed')
    .gte(
      'start_time',
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    )

  if (error) throw error

  const appointmentRecords = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRecords.length === 0) {
    return []
  }

  // Group by customer and find last visit
  const customerLastVisit = new Map<string, Date>()
  const customerVisitCount = new Map<string, number>()

  for (const apt of appointmentRecords) {
    if (!apt.start_time || !apt.customer_id) continue
    const visitDate = new Date(apt.start_time)
    if (
      !customerLastVisit.has(apt.customer_id) ||
      visitDate > customerLastVisit.get(apt.customer_id)!
    ) {
      customerLastVisit.set(apt.customer_id, visitDate)
    }
    customerVisitCount.set(
      apt.customer_id,
      (customerVisitCount.get(apt.customer_id) || 0) + 1
    )
  }

  const now = new Date()
  const atRiskCustomers: Array<{
    customerId: string
    daysSinceLastVisit: number
    visitCount: number
  }> = []

  // Identify at-risk customers (haven't visited in 60+ days but visited within last 180 days)
  for (const [customerId, lastVisit] of customerLastVisit) {
    const daysSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceLastVisit >= 60 && daysSinceLastVisit <= 180) {
      atRiskCustomers.push({
        customerId,
        daysSinceLastVisit: Math.round(daysSinceLastVisit),
        visitCount: customerVisitCount.get(customerId) || 0,
      })
    }
  }

  // Sort by days since last visit (descending)
  atRiskCustomers.sort((a, b) => b.daysSinceLastVisit - a.daysSinceLastVisit)

  // Get customer details
  const customerIds = atRiskCustomers.slice(0, limit).map((c) => c.customerId)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles_view')
    .select('id, full_name, email, phone')
    .in('id', customerIds)

  if (profileError) throw profileError

  const profileRecords = (profiles ?? []) as Array<ProfileSummary>

  return atRiskCustomers.slice(0, limit).map((item) => {
    const profile = profileRecords.find((p) => p.id === item.customerId)
    return {
      id: item.customerId,
      name: profile?.full_name || 'Unknown',
      email: profile?.email || '',
      phone: profile?.phone || '',
      daysSinceLastVisit: item.daysSinceLastVisit,
      visitCount: item.visitCount,
    }
  })
}
