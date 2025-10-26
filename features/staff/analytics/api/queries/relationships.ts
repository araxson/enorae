import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

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
  created_at: string
  profiles: {
    username: string | null
  } | null
}

export async function getStaffCustomerRelationships(
  staffId?: string,
  limit = 20
): Promise<CustomerRelationship[]> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const targetStaffId = staffId || user.id

  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select(`
      id,
      customer_id,
      created_at,
      profiles:customer_id (
        username
      )
    `)
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error

  // Aggregate by customer
  const customerMap = new Map<string, {
    name: string
    appointments: number
    revenue: number
    lastDate: string
    services: string[]
  }>()

  const customerAppointments = (appointments as unknown as AppointmentWithCustomerProfile[] | null) ?? []

  customerAppointments.forEach((appt: AppointmentWithCustomerProfile) => {
    const customerId = appt.customer_id
    const customerName = appt.profiles?.username || 'Unknown Customer'

    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        name: customerName,
        appointments: 0,
        revenue: 0,
        lastDate: appt.created_at,
        services: []
      })
    }

    const customer = customerMap.get(customerId)!
    customer.appointments += 1
    customer.revenue += 50 // Placeholder - would need to fetch actual pricing
    if (new Date(appt.created_at) > new Date(customer.lastDate)) {
      customer.lastDate = appt.created_at
    }
  })

  return Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customer_id: customerId,
      customer_name: data.name,
      total_appointments: data.appointments,
      total_spent: data.revenue,
      last_appointment_date: data.lastDate,
      favorite_service: data.services[0] || 'N/A',
    }))
    .sort((a, b) => b.total_appointments - a.total_appointments)
    .slice(0, limit)
}
