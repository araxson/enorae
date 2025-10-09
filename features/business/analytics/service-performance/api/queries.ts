import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface ServicePerformance {
  service_id: string
  service_name: string
  total_bookings: number
  total_revenue: number
  avg_rating: number
  cancellation_rate: number
  popularity_score: number
}

export async function getServicePerformance(salonId: string, dateFrom?: string, dateTo?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_service_performance', {
      p_salon_id: salonId,
      p_start_date: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      p_end_date: dateTo || new Date().toISOString(),
    })

  if (error) throw error
  return data as ServicePerformance[]
}

export async function refreshServicePerformance(serviceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('refresh_service_performance', {
      p_service_id: serviceId,
    })

  if (error) throw error
  return data
}

export async function getTrendingServices(salonId: string, limit = 5) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      name,
      price,
      duration_minutes,
      is_active,
      appointments:appointments(count)
    `)
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getServiceRevenue(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('service_id, total_price, status')
    .eq('salon_id', salonId)
    .in('status', ['completed', 'confirmed'])

  if (error) throw error

  // Aggregate revenue by service
  const revenueByService = (data || []).reduce((acc: Record<string, number>, appointment) => {
    const serviceId = appointment.service_id
    if (serviceId) {
      acc[serviceId] = (acc[serviceId] || 0) + (appointment.total_price || 0)
    }
    return acc
  }, {})

  return revenueByService
}

export async function getServiceCosts(serviceIds: string[]) {
  if (serviceIds.length === 0) return {}

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .select('service_id, cost')
    .in('service_id', serviceIds)

  if (error) throw error

  return (data || []).reduce<Record<string, number>>((acc, row) => {
    if (row.service_id) {
      acc[row.service_id] = Number(row.cost || 0)
    }
    return acc
  }, {})
}

export async function getServiceStaffLeaders(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointment_services')
    .select('service_id, service_name, staff_id, staff_name, current_price, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  const staffByService = new Map<
    string,
    {
      service_name: string
      staff: Map<
        string,
        { staff_id: string; staff_name: string; appointmentCount: number; revenue: number }
      >
    }
  >()

  for (const entry of data || []) {
    if (!entry.service_id || !entry.staff_id) continue
    if (!staffByService.has(entry.service_id)) {
      staffByService.set(entry.service_id, {
        service_name: entry.service_name || 'Service',
        staff: new Map(),
      })
    }
    const serviceRecord = staffByService.get(entry.service_id)!
    if (!serviceRecord.staff.has(entry.staff_id)) {
      serviceRecord.staff.set(entry.staff_id, {
        staff_id: entry.staff_id,
        staff_name: entry.staff_name || 'Staff',
        appointmentCount: 0,
        revenue: 0,
      })
    }
    const staffEntry = serviceRecord.staff.get(entry.staff_id)!
    staffEntry.appointmentCount += 1
    staffEntry.revenue += Number(entry.current_price || 0)
  }

  return Array.from(staffByService.entries()).map(([serviceId, record]) => ({
    service_id: serviceId,
    service_name: record.service_name,
    staff: Array.from(record.staff.values()).sort((a, b) => b.revenue - a.revenue),
  }))
}

export async function getServicePairings(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointment_services')
    .select('appointment_id, service_id, service_name')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  const servicesByAppointment = new Map<string, Array<{ id: string; name: string }>>()

  for (const entry of data || []) {
    if (!entry.appointment_id || !entry.service_id) continue
    const list = servicesByAppointment.get(entry.appointment_id) || []
    list.push({ id: entry.service_id, name: entry.service_name || 'Service' })
    servicesByAppointment.set(entry.appointment_id, list)
  }

  const pairings = new Map<string, { primary: string; paired: string; count: number }>()

  servicesByAppointment.forEach((services) => {
    if (services.length < 2) return
    for (let i = 0; i < services.length; i += 1) {
      for (let j = 0; j < services.length; j += 1) {
        if (i === j) continue
        const key = `${services[i].id}->${services[j].id}`
        if (!pairings.has(key)) {
          pairings.set(key, {
            primary: services[i].name,
            paired: services[j].name,
            count: 0,
          })
        }
        pairings.get(key)!.count += 1
      }
    }
  })

  return Array.from(pairings.values()).sort((a, b) => b.count - a.count).slice(0, 10)
}

export async function getServiceDurationAccuracy(salonId: string, serviceIds: string[]) {
  if (serviceIds.length === 0) return []

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const [rulesResponse, appointmentsResponse] = await Promise.all([
    supabase
      .schema('catalog')
      .from('service_booking_rules')
      .select('service_id, duration_minutes')
      .in('service_id', serviceIds),
    supabase
      .from('appointment_services')
      .select('service_id, service_name, duration_minutes')
      .eq('salon_id', salonId)
      .eq('status', 'completed')
      .in('service_id', serviceIds),
  ])

  if (appointmentsResponse.error) throw appointmentsResponse.error
  if (rulesResponse.error) throw rulesResponse.error

  const expectedMap = new Map<string, number>()
  for (const rule of rulesResponse.data || []) {
    if (rule.service_id && rule.duration_minutes) {
      expectedMap.set(rule.service_id, Number(rule.duration_minutes))
    }
  }

  const aggregates = new Map<
    string,
    { name: string; total: number; count: number; expected?: number }
  >()

  for (const record of appointmentsResponse.data || []) {
    if (!record.service_id || !record.duration_minutes) continue
    if (!aggregates.has(record.service_id)) {
      aggregates.set(record.service_id, {
        name: record.service_name || 'Service',
        total: 0,
        count: 0,
        expected: expectedMap.get(record.service_id),
      })
    }
    const aggregate = aggregates.get(record.service_id)!
    aggregate.total += Number(record.duration_minutes)
    aggregate.count += 1
  }

  return Array.from(aggregates.entries()).map(([serviceId, value]) => {
    const actualAverage = value.count ? value.total / value.count : null
    const variance =
      value.expected != null && actualAverage != null
        ? Number((actualAverage - value.expected).toFixed(1))
        : null
    return {
      service_id: serviceId,
      service_name: value.name,
      expected_duration: value.expected ?? null,
      actual_duration: actualAverage ? Number(actualAverage.toFixed(1)) : null,
      variance,
    }
  })
}
