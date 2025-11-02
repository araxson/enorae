import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import {
  fetchAppointmentServices,
  fetchAppointments,
  fetchNameMaps,
  fetchReviewAggregation,
} from './data-access'
import {
  buildMetricsList,
  groupAppointmentsByCustomer,
  groupServicesByCustomer,
} from './transformers'
import { selectTopByLifetimeValue } from '@/lib/utils/insights'
import type { CustomerMetrics } from '../../types'
import { createOperationLogger } from '@/lib/observability/logger'

export async function getCustomerInsights(
  limit = 50,
): Promise<CustomerMetrics[]> {
  const logger = createOperationLogger('getCustomerInsights', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const appointments = await fetchAppointments(supabase, salonId)

  if (appointments.length === 0) {
    return []
  }

  const {
    customerMap,
    appointmentToCustomer,
    appointmentStaffMap,
  } = groupAppointmentsByCustomer(appointments)

  const customerIds = Array.from(customerMap.keys())
  const appointmentIds = appointments
    .map((appointment) => appointment.id)
    .filter((id): id is string => Boolean(id))

  const [reviewMap, appointmentServices] = await Promise.all([
    fetchReviewAggregation(supabase, salonId, customerIds),
    fetchAppointmentServices(supabase, appointmentIds),
  ])

  const { aggregation, serviceIds, staffIds } = groupServicesByCustomer(
    appointmentServices,
    appointmentToCustomer,
    appointmentStaffMap,
  )

  const { staffNameMap, serviceNameMap } = await fetchNameMaps(
    supabase,
    staffIds,
    serviceIds,
  )

  const metrics = buildMetricsList(
    customerMap,
    reviewMap,
    aggregation,
    staffNameMap,
    serviceNameMap,
  )

  return selectTopByLifetimeValue(metrics, limit)
}
