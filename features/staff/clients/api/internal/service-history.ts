import 'server-only'
import { verifyStaffOwnership } from './auth'
import type { Appointment, ClientServiceHistory } from './types'

export async function getClientServiceHistory(staffId: string, customerId: string): Promise<ClientServiceHistory[]> {
  const { supabase } = await verifyStaffOwnership(staffId)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .eq('status', 'completed')

  if (!appointments) return []

  const serviceMap = new Map<string, ClientServiceHistory>()

  appointments.forEach((apt) => {
    const appointment = apt as Appointment
    const services = Array.isArray(appointment['service_names']) && appointment['service_names'].length > 0
      ? appointment['service_names']
      : appointment['service_name']
        ? [appointment['service_name']]
        : ['Unknown Service']
    const price = appointment['total_price'] || 0

    services.forEach((serviceName) => {
      const existing = serviceMap.get(serviceName)
      if (existing) {
        existing.times_booked += 1
        existing.total_spent += price
        existing.avg_price = existing.total_spent / existing.times_booked
        if (
          appointment['start_time'] &&
          (!existing.last_booked || appointment['start_time'] > existing.last_booked)
        ) {
          existing.last_booked = appointment['start_time']
        }
      } else {
        serviceMap.set(serviceName, {
          service_name: serviceName,
          times_booked: 1,
          total_spent: price,
          avg_price: price,
          last_booked: appointment['start_time'] || null,
        })
      }
    })
  })

  return Array.from(serviceMap.values()).sort((a, b) => b.times_booked - a.times_booked)
}
