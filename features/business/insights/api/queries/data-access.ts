import 'server-only'
import type { ServerSupabaseClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability'
import type {
  AppointmentServiceRow,
  AppointmentWithProfile,
  ReviewRow,
  ReviewSummary,
  ServiceRow,
  StaffProfileRow,
} from '../../api/types'

type Client = ServerSupabaseClient

export async function fetchAppointments(
  client: Client,
  salonId: string,
): Promise<AppointmentWithProfile[]> {
  const logger = createOperationLogger('fetchAppointments', {})
  logger.start()

  const { data, error } = await client
    .from('appointments_view')
    .select(`
      id,
      customer_id,
      staff_id,
      created_at,
      status
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error

  const appointments = data ?? []

  // Fetch customer profiles separately
  const customerIds = [
    ...new Set(
      appointments
        .map((a) => a.customer_id)
        .filter((id): id is string => typeof id === 'string')
    )
  ]
  let profilesMap = new Map<string, { username: string | null }>()

  if (customerIds.length > 0) {
    const { data: profiles } = await client
      .from('profiles_view')
      .select('id, username')
      .in('id', customerIds)

    if (profiles) {
      profiles.forEach((p) => {
        if (p.id) {
          profilesMap.set(p.id, { username: p.username })
        }
      })
    }
  }

  return appointments.map((a) => ({
    ...a,
    profiles: a.customer_id ? profilesMap.get(a.customer_id) || null : null,
  })) as AppointmentWithProfile[]
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
    if (!review['customer_id']) return

    const existing = summary.get(review['customer_id']) ?? { total: 0, count: 0 }
    existing.total += review['rating'] ?? 0
    existing.count += 1
    summary.set(review['customer_id'], existing)
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

  const { data, error} = await client
    .schema('scheduling')
    .from('appointment_services')
    .select('*')
    .in('appointment_id', appointmentIds)

  if (error) throw error
  return (data as AppointmentServiceRow[]) ?? []
}

export async function fetchNameMaps(
  client: Client,
  staffIds: Set<string>,
  serviceIds: Set<string>,
) {
  const [staffProfiles, services] = await Promise.all([
    staffIds.size
      ? client
          .from('profiles_view')
          .select('id, username')
          .in('id', Array.from(staffIds))
      : Promise.resolve({ data: [], error: null }),
    serviceIds.size
      ? client
          .from('services_view')
          .select('id, name')
          .in('id', Array.from(serviceIds))
      : Promise.resolve({ data: [], error: null }),
  ])

  if (staffProfiles.error) throw staffProfiles.error
  if (services.error) throw services.error

  const staffNameMap = new Map<string, string>()
  ;(staffProfiles.data ?? []).forEach((entry) => {
    if (entry && typeof entry === 'object' && 'id' in entry && 'username' in entry) {
      const profile = entry as StaffProfileRow
      if (profile.id) {
        staffNameMap.set(profile.id, profile.username || 'N/A')
      }
    }
  })

  const serviceNameMap = new Map<string, string>()
  ;(services.data ?? []).forEach((entry) => {
    if (entry && typeof entry === 'object' && 'id' in entry && 'name' in entry) {
      const service = entry as Pick<ServiceRow, 'id' | 'name'>
      if (service.id) {
        serviceNameMap.set(service.id, service.name || 'N/A')
      }
    }
  })

  return { staffNameMap, serviceNameMap }
}
