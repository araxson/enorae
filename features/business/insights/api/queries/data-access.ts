import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import type {
  AppointmentServiceRow,
  AppointmentWithProfile,
  ReviewRow,
  ReviewSummary,
  ServiceRow,
  StaffProfileRow,
} from './customer-types'

type Client = SupabaseClient<Database>

export async function fetchAppointments(
  client: Client,
  salonId: string,
): Promise<AppointmentWithProfile[]> {
  const { data, error } = await client
    .from('appointments')
    .select(`
      id,
      customer_id,
      staff_id,
      created_at,
      status,
      profiles:customer_id (
        username
      )
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as AppointmentWithProfile[]
}

export async function fetchReviewAggregation(
  client: Client,
  salonId: string,
  customerIds: string[],
): Promise<Map<string, ReviewSummary>> {
  if (customerIds.length === 0) {
    return new Map()
  }

  const { data, error } = await client
    .from('salon_reviews_view')
    .select('customer_id, rating')
    .eq('salon_id', salonId)
    .in('customer_id', customerIds)

  if (error) throw error

  const summary = new Map<string, ReviewSummary>()

  ;(data ?? []).forEach((entry) => {
    const review = entry as ReviewRow
    if (!review.customer_id) return

    const existing = summary.get(review.customer_id) ?? { total: 0, count: 0 }
    existing.total += review.rating ?? 0
    existing.count += 1
    summary.set(review.customer_id, existing)
  })

  return summary
}

export async function fetchAppointmentServices(
  client: Client,
  appointmentIds: string[],
): Promise<AppointmentServiceRow[]> {
  if (appointmentIds.length === 0) {
    return []
  }

  const { data, error } = await client
    .from('appointment_services')
    .select('*')
    .in('appointment_id', appointmentIds)

  if (error) throw error
  return (data ?? []) as AppointmentServiceRow[]
}

export async function fetchNameMaps(
  client: Client,
  staffIds: Set<string>,
  serviceIds: Set<string>,
) {
  const [staffProfiles, services] = await Promise.all([
    staffIds.size
      ? client
          .from('profiles')
          .select('id, username')
          .in('id', Array.from(staffIds))
      : Promise.resolve({ data: [], error: null }),
    serviceIds.size
      ? client
          .from('services')
          .select('id, name')
          .in('id', Array.from(serviceIds))
      : Promise.resolve({ data: [], error: null }),
  ])

  if (staffProfiles.error) throw staffProfiles.error
  if (services.error) throw services.error

  const staffNameMap = new Map<string, string>()
  ;(staffProfiles.data ?? []).forEach((entry) => {
    const profile = entry as StaffProfileRow
    if (profile.id) {
      staffNameMap.set(profile.id, profile.username || 'N/A')
    }
  })

  const serviceNameMap = new Map<string, string>()
  ;(services.data ?? []).forEach((entry) => {
    const service = entry as Pick<ServiceRow, 'id' | 'name'>
    if (service.id) {
      serviceNameMap.set(service.id, service.name || 'N/A')
    }
  })

  return { staffNameMap, serviceNameMap }
}
