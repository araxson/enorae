import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import type { AppointmentSummary } from './analytics-types'

export interface CustomerRelationship {
  customer_id: string
  customer_name: string
  total_appointments: number
  total_spent: number
  last_appointment_date: string
  favorite_service: string
}

export async function getStaffCustomerRelationships(
  staffId?: string,
  limit = 20
): Promise<CustomerRelationship[]> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const targetStaffId = staffProfile.id

  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('id, customer_id, created_at, start_time, status')
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .order('start_time', { ascending: false })
    .limit(100)
    .returns<AppointmentSummary[]>()

  if (error) throw error

  // Aggregate by customer
  const customerMap = new Map<string, {
    name: string
    appointments: number
    revenue: number
    lastDate: string
    serviceCounts: Map<string, number>
  }>()

  const appointmentRows = appointments ?? []

  appointmentRows.forEach(appt => {
    const customerId = appt.customer_id
    if (!customerId) return
    const customerName = customerId // Use customer_id as fallback since name/email not in appointments table

    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        name: customerName,
        appointments: 0,
        revenue: 0,
        lastDate: appt.created_at ?? '',
        serviceCounts: new Map<string, number>(),
      })
    }

    const customer = customerMap.get(customerId)
    if (!customer) return

    customer.appointments += 1
    const referenceDate = appt.start_time ?? appt.created_at
    if (referenceDate && (!customer.lastDate || new Date(referenceDate) > new Date(customer.lastDate))) {
      customer.lastDate = referenceDate
    }
  })

  return Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customer_id: customerId,
      customer_name: data.name,
      total_appointments: data.appointments,
      total_spent: data.revenue,
      last_appointment_date: data.lastDate,
      favorite_service:
        Array.from(data.serviceCounts.entries())
          .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A',
    }))
    .sort((a, b) => b.total_appointments - a.total_appointments)
    .slice(0, limit)
}
