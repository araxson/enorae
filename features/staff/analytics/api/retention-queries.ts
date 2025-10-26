import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import type { AppointmentSummary, AppointmentServiceSummary } from './types'

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
    .from('appointments')
    .select('id, customer_id, customer_name, customer_email, created_at')
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
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
    const customerName = appt.customer_name || appt.customer_email || 'Unknown Customer'

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
    if (appt.created_at && (!customer.lastDate || new Date(appt.created_at) > new Date(customer.lastDate))) {
      customer.lastDate = appt.created_at
    }
  })

  const appointmentIds = appointmentRows
    .map(appt => appt.id)
    .filter((id): id is string => Boolean(id))

  if (appointmentIds.length > 0) {
    const { data: serviceRows, error: servicesError } = await supabase
      .from('appointment_services')
      .select('appointment_id, service_name, service_price, customer_id, staff_id, created_at')
      .in('appointment_id', appointmentIds)
      .eq('staff_id', targetStaffId)
      .returns<AppointmentServiceSummary[]>()

    if (servicesError) throw servicesError

    serviceRows?.forEach(service => {
      if (!service.customer_id) return
      const customer = customerMap.get(service.customer_id)
      if (!customer) return

      customer.revenue += Number(service.service_price ?? 0)
      const serviceName = service.service_name ?? 'Service'
      const serviceCount = customer.serviceCounts.get(serviceName) ?? 0
      customer.serviceCounts.set(serviceName, serviceCount + 1)

      if (service.created_at && (!customer.lastDate || new Date(service.created_at) > new Date(customer.lastDate))) {
        customer.lastDate = service.created_at
      }
    })
  }

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
