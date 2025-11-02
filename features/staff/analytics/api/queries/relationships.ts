import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { verifyStaffOwnership } from '@/lib/auth/staff'
import { createOperationLogger } from '@/lib/observability'
import { QUERY_LIMITS } from '@/lib/config/constants'

export interface CustomerRelationship {
  customer_id: string
  customer_name: string
  total_appointments: number
  total_spent: number
  last_appointment_date: string
  favorite_service: string
}

type AppointmentWithCustomerProfile = {
  customer_id: string
  start_time: string
}

export async function getStaffCustomerRelationships(
  staffId?: string,
  limit = QUERY_LIMITS.RECENT_ITEMS
): Promise<CustomerRelationship[]> {
  const logger = createOperationLogger('getStaffCustomerRelationships', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const { supabase, staffProfile } = await verifyStaffOwnership(staffId)
  const targetStaffId = staffProfile.id

  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, start_time')
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .order('start_time', { ascending: false })
    .limit(QUERY_LIMITS.MEDIUM_LIST)
    .returns<AppointmentWithCustomerProfile[]>()

  if (error) throw error

  // Aggregate by customer
  const customerMap = new Map<string, {
    name: string | null
    appointments: number
    revenue: number
    lastDate: string
    services: string[]
  }>()

  const customerAppointments = appointments ?? []

  customerAppointments.forEach((appt) => {
    const customerId = appt.customer_id
    const customerName = null

    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        name: customerName,
        appointments: 0,
        revenue: 0,
        lastDate: appt.start_time,
        services: []
      })
    }

    const customer = customerMap.get(customerId)!
    customer.appointments += 1
    if (new Date(appt.start_time) > new Date(customer.lastDate)) {
      customer.lastDate = appt.start_time
    }
  })

  const customerIds = Array.from(customerMap.keys()).filter(Boolean)
  if (customerIds.length > 0) {
    const { data: customerProfiles, error: profileError } = await supabase
      .from('profiles_view')
      .select('id, full_name, username')
      .in('id', customerIds)
      .returns<Array<{ id: string; full_name: string | null; username: string | null }>>()

    if (profileError) throw profileError

    customerProfiles?.forEach((profile) => {
      const entry = customerMap.get(profile.id)
      if (entry) {
        entry.name = profile.full_name ?? profile.username ?? 'Customer'
      }
    })
  }

  return Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customer_id: customerId,
      customer_name: data.name ?? 'Customer',
      total_appointments: data.appointments,
      total_spent: 0,
      last_appointment_date: data.lastDate,
      favorite_service: data.services[0] || 'N/A',
    }))
    .sort((a, b) => b.total_appointments - a.total_appointments)
    .slice(0, limit)
}
