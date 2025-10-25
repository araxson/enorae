import 'server-only'

import type { AppointmentRow, CommissionRate, ServiceRevenue } from './types'
import {
  authorizeStaffAccess,
  calculateDefaultCommission,
} from './helpers'

const DEFAULT_COMMISSION_PERCENTAGE = 40
const DEFAULT_COMMISSION_RATE = DEFAULT_COMMISSION_PERCENTAGE / 100

function buildServiceMap(entries: AppointmentRow[] | null | undefined) {
  const serviceMap = new Map<string, ServiceRevenue>()

  entries?.forEach((entry) => {
    const serviceNames = Array.isArray(entry['service_names'])
      ? entry['service_names']
      : ['Unknown Service']
    const revenue = entry['total_price'] || 0

    serviceNames.forEach(serviceName => {
      const existing = serviceMap.get(serviceName)
      if (existing) {
        existing.revenue += revenue
        existing.count += 1
      } else {
        serviceMap.set(serviceName, {
          service_name: serviceName,
          revenue,
          count: 1,
        })
      }
    })
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

  return Array.from(buildServiceMap(data as AppointmentRow[]).values()).sort(
    (a, b) => b.revenue - a.revenue,
  )
}

export async function getCommissionRates(
  staffId: string,
): Promise<CommissionRate[]> {
  const { supabase } = await authorizeStaffAccess(staffId)

  const { data: services, error } = await supabase
    .from('staff_services_view')
    .select('service_id, service_name, effective_price')
    .eq('staff_id', staffId)
    .eq('is_available', true)

  if (error) throw error

  type StaffServiceRate = {
    service_id: string | null
    service_name: string | null
    effective_price: number | null
  }

  return ((services as StaffServiceRate[]) || []).map((service) => ({
    service_id: service['service_id'] ?? '',
    service_name: service['service_name'] ?? 'Unknown Service',
    base_price: service.effective_price ?? 0,
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

  const serviceMap = buildServiceMap(data as AppointmentRow[])

  serviceMap.forEach((value) => {
    const commissionAmount = calculateDefaultCommission(
      value.revenue,
      DEFAULT_COMMISSION_RATE,
    )

    value.commission_rate = DEFAULT_COMMISSION_PERCENTAGE
    value.commission_amount =
      (value.commission_amount ?? 0) + commissionAmount
  })

  return Array.from(serviceMap.values()).sort(
    (a, b) => b.revenue - a.revenue,
  )
}
