import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

type AppointmentSummary = {
  customer_id: string
  start_time: string | null
}

/**
 * Get customer segmentation
 */
export async function getCustomerSegments() {
  const logger = createOperationLogger('getCustomerSegments', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all customer appointments
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRows.length === 0) {
    return {
      champions: 0,
      loyalCustomers: 0,
      potentialLoyalists: 0,
      newCustomers: 0,
      atRisk: 0,
      churned: 0,
    }
  }

  // Calculate RFM (Recency, Frequency, Monetary) for each customer
  const customerData = new Map<
    string,
    {
      lastVisit: Date
      visitCount: number
      firstVisit: Date
    }
  >()

  for (const apt of appointmentRows) {
    if (!apt.start_time) continue
    const visitDate = new Date(apt.start_time)
    if (!customerData.has(apt.customer_id)) {
      customerData.set(apt.customer_id, {
        lastVisit: visitDate,
        visitCount: 1,
        firstVisit: visitDate,
      })
    } else {
      const data = customerData.get(apt.customer_id)!
      data.visitCount++
      if (visitDate > data.lastVisit) data.lastVisit = visitDate
      if (visitDate < data.firstVisit) data.firstVisit = visitDate
    }
  }

  const now = new Date()
  const segments = {
    champions: 0, // High frequency, recent visit
    loyalCustomers: 0, // High frequency, somewhat recent
    potentialLoyalists: 0, // Moderate frequency, recent
    newCustomers: 0, // Low frequency, recent
    atRisk: 0, // High frequency, not recent
    churned: 0, // Low frequency, not recent
  }

  for (const [_, data] of customerData) {
    const daysSinceLastVisit =
      (now.getTime() - data.lastVisit.getTime()) / (1000 * 60 * 60 * 24)

    const isRecent = daysSinceLastVisit <= 90
    const isHighFrequency = data.visitCount >= 5
    const isMediumFrequency = data.visitCount >= 3 && data.visitCount < 5
    const isNew = data.visitCount <= 2

    if (isHighFrequency && isRecent) {
      segments.champions++
    } else if (isHighFrequency && !isRecent && daysSinceLastVisit <= 180) {
      segments.loyalCustomers++
    } else if (isHighFrequency && daysSinceLastVisit > 180) {
      segments.atRisk++
    } else if (isMediumFrequency && isRecent) {
      segments.potentialLoyalists++
    } else if (isNew && isRecent) {
      segments.newCustomers++
    } else {
      segments.churned++
    }
  }

  return segments
}
