import 'server-only'

import type { AppointmentRow, CommissionRate, ServiceRevenue } from './types'
import { authorizeStaffAccess } from '@/lib/utils/commission'

const DEFAULT_COMMISSION_PERCENTAGE = 40

function buildServiceMap(entries: AppointmentRow[] | null | undefined) {
  const serviceMap = new Map<string, ServiceRevenue>()

  entries?.forEach((entry) => {
    const serviceName = entry['id'] || 'Unknown Service'
    const existing = serviceMap.get(serviceName)
    if (existing) {
      existing.count += 1
    } else {
      serviceMap.set(serviceName, {
        service_name: serviceName,
        revenue: 0,
        count: 1,
      })
    }
  })

  return serviceMap
}

export async function getServiceBreakdown(
  staffId: string,
  dateFrom: string,
  dateTo: string,
): Promise<ServiceRevenue[]> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)

  if (error) throw error

  return Array.from(buildServiceMap(data as any[]).values()).sort(
    (a, b) => b.revenue - a.revenue,
  )
}

export async function getCommissionRates(
  staffId: string,
): Promise<CommissionRate[]> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const { data: services, error } = await supabase
    .from('staff_services_view')
    .select('service_id, service_name')
    .eq('staff_id', staffId)
    .eq('is_available', true)

  if (error) throw error

  return ((services as any[]) || []).map((service: any) => ({
    service_id: service['service_id'] ?? '',
    service_name: service['service_name'] ?? 'Unknown Service',
    base_price: 0,
    commission_percentage: DEFAULT_COMMISSION_PERCENTAGE,
    commission_flat_rate: null,
  }))
}

export async function getServiceCommissionBreakdown(
  staffId: string,
  dateFrom: string,
  dateTo: string,
): Promise<ServiceRevenue[]> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)

  if (error) throw error

  const serviceMap = buildServiceMap(data as any[])

  serviceMap.forEach((value) => {
    value.commission_rate = DEFAULT_COMMISSION_PERCENTAGE
    value.commission_amount = value.commission_amount ?? 0
  })

  return Array.from(serviceMap.values()).sort(
    (a, b) => b.revenue - a.revenue,
  )
}
