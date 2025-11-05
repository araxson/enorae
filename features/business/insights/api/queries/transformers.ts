import 'server-only'
import type { CustomerMetrics } from '../../api/types'
import type {
  AppointmentWithProfile,
  CustomerAggregate,
  ReviewSummary,
  ServiceAggregation,
} from '../../api/types'
import { calculateSegment } from '@/features/business/insights/utils'
import { createOperationLogger } from '@/lib/observability'
import { ANALYTICS_CONFIG } from '@/lib/config/constants'

export function groupAppointmentsByCustomer(
  appointments: AppointmentWithProfile[],
): {
  customerMap: Map<string, CustomerAggregate>
  appointmentToCustomer: Map<string, string>
  appointmentStaffMap: Map<string, string>
} {
  const customerMap = new Map<string, CustomerAggregate>()
  const appointmentToCustomer = new Map<string, string>()
  const appointmentStaffMap = new Map<string, string>()

  appointments.forEach((appointment) => {
    if (!appointment.id) return

    appointmentToCustomer.set(appointment.id, appointment.customer_id)

    if (appointment.staff_id) {
      appointmentStaffMap.set(appointment.id, appointment.staff_id)
    }

    if (!customerMap.has(appointment.customer_id)) {
      customerMap.set(appointment.customer_id, {
        customerId: appointment.customer_id,
        name: appointment.profiles?.username || 'Unknown',
        email: '',
        appointments: [],
      })
    }

    const customer = customerMap.get(appointment.customer_id)
    if (customer) {
      customer.appointments.push(appointment)
    }
  })

  return { customerMap, appointmentToCustomer, appointmentStaffMap }
}

export function groupServicesByCustomer(
  rows: Array<{ appointment_id: string | null; service_id: string | null; staff_id: string | null }>,
  appointmentToCustomer: Map<string, string>,
  appointmentStaffMap: Map<string, string>,
): {
  aggregation: Map<string, ServiceAggregation>
  serviceIds: Set<string>
  staffIds: Set<string>
} {
  const aggregation = new Map<string, ServiceAggregation>()
  const serviceIds = new Set<string>()
  const staffIds = new Set<string>()

  rows.forEach((entry) => {
    const appointmentId = entry.appointment_id ?? undefined
    if (!appointmentId) return

    const customerId = appointmentToCustomer.get(appointmentId)
    if (!customerId) return

    if (!aggregation.has(customerId)) {
      aggregation.set(customerId, {
        serviceCounts: new Map(),
        staffCounts: new Map(),
      })
    }

    const aggregate = aggregation.get(customerId)
    if (!aggregate) return

    if (entry.service_id) {
      aggregate.serviceCounts.set(
        entry.service_id,
        (aggregate.serviceCounts.get(entry.service_id) ?? 0) + 1,
      )
      serviceIds.add(entry.service_id)
    }

    const staffId = entry.staff_id ?? appointmentStaffMap.get(appointmentId)
    if (staffId) {
      aggregate.staffCounts.set(
        staffId,
        (aggregate.staffCounts.get(staffId) ?? 0) + 1,
      )
      staffIds.add(staffId)
    }
  })

  return { aggregation, serviceIds, staffIds }
}

export function buildMetricsList(
  customerMap: Map<string, CustomerAggregate>,
  reviewMap: Map<string, ReviewSummary>,
  serviceAggregation: Map<string, ServiceAggregation>,
  staffNameMap: Map<string, string>,
  serviceNameMap: Map<string, string>,
): CustomerMetrics[] {
  const metrics: CustomerMetrics[] = []

  for (const { customerId, name, email, appointments } of customerMap.values()) {
    const completedAppointments = appointments.filter(
      (appointment) => appointment.status === 'completed',
    )
    const cancelledAppointments = appointments.filter(
      (appointment) => appointment.status === 'cancelled',
    )
    const noShowAppointments = appointments.filter(
      (appointment) => appointment.status === 'no_show',
    )

    const firstVisit = appointments[appointments.length - 1]?.created_at
    const lastVisit = appointments[0]?.created_at
    const totalAppointments = appointments.length
    const totalVisits = completedAppointments.length

    const reviewSummary = reviewMap.get(customerId)
    const reviewCount = reviewSummary?.count ?? 0
    const averageRating =
      reviewSummary && reviewSummary.count > 0
        ? reviewSummary.total / reviewSummary.count
        : 0

    const aggregate = serviceAggregation.get(customerId)
    const totalServices = aggregate
      ? Array.from(aggregate.serviceCounts.values()).reduce(
          (sum, count) => sum + count,
          0,
        )
      : 0

    const favoriteServiceEntry =
      aggregate && aggregate.serviceCounts.size > 0
        ? Array.from(aggregate.serviceCounts.entries()).sort(
            (a, b) => b[1] - a[1],
          )[0]
        : undefined
    const favoriteServiceName =
      favoriteServiceEntry
        ? serviceNameMap.get(favoriteServiceEntry[0]) ?? 'N/A'
        : 'N/A'

    const favoriteStaffEntry =
      aggregate && aggregate.staffCounts.size > 0
        ? Array.from(aggregate.staffCounts.entries()).sort(
            (a, b) => b[1] - a[1],
          )[0]
        : undefined
    const favoriteStaffName =
      favoriteStaffEntry
        ? staffNameMap.get(favoriteStaffEntry[0]) ?? 'N/A'
        : 'N/A'

    const lifetimeValue = totalVisits * ANALYTICS_CONFIG.DEFAULT_AVERAGE_SERVICE_PRICE
    const cancellationRate =
      totalAppointments > 0
        ? (cancelledAppointments.length / totalAppointments) * ANALYTICS_CONFIG.PERCENTAGE_MULTIPLIER
        : 0
    const noShowRate =
      totalAppointments > 0
        ? (noShowAppointments.length / totalAppointments) * ANALYTICS_CONFIG.PERCENTAGE_MULTIPLIER
        : 0

    const segment = calculateSegment({
      totalVisits,
      lastVisitDate: lastVisit || new Date().toISOString(),
      lifetimeValue,
      cancellationRate,
    })

    metrics.push({
      customer_id: customerId,
      customer_name: name,
      customer_email: email,
      first_visit_date: firstVisit || new Date().toISOString(),
      last_visit_date: lastVisit || new Date().toISOString(),
      total_visits: totalVisits,
      total_appointments: totalAppointments,
      completed_appointments: completedAppointments.length,
      cancelled_appointments: cancelledAppointments.length,
      no_show_appointments: noShowAppointments.length,
      cancellation_rate: cancellationRate,
      no_show_rate: noShowRate,
      review_count: reviewCount,
      average_rating: averageRating,
      total_services: totalServices,
      favorite_service_name: favoriteServiceName,
      favorite_staff_name: favoriteStaffName,
      lifetime_value: lifetimeValue,
      segment,
    })
  }

  return metrics
}
