import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

type AppointmentSummary = {
  customer_id: string
  start_time: string | null
}

/**
 * Get customer cohort analysis
 */
export async function getCustomerCohorts() {
  const logger = createOperationLogger('getCustomerCohorts', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get first visit date for each customer
  const { data: firstVisits, error: firstVisitsError } = await supabase
    .from('appointments_view')
    .select('customer_id, start_time')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })

  if (firstVisitsError) throw firstVisitsError

  const firstVisitRows = (firstVisits ?? []) as AppointmentSummary[]

  if (firstVisitRows.length === 0) {
    return []
  }

  // Group customers by first visit month
  const cohortMap = new Map<
    string,
    {
      cohortMonth: string
      customers: Set<string>
      totalRevenue: number
    }
  >()

  for (const visit of firstVisitRows) {
    if (!visit.start_time) continue
    const cohortMonth = new Date(visit.start_time).toISOString().substring(0, 7) // YYYY-MM
    if (!cohortMap.has(cohortMonth)) {
      cohortMap.set(cohortMonth, {
        cohortMonth,
        customers: new Set(),
        totalRevenue: 0,
      })
    }
    cohortMap.get(cohortMonth)!.customers.add(visit.customer_id)
  }

  // Convert to array and calculate metrics
  const cohorts = Array.from(cohortMap.values()).map((cohort) => ({
    cohortMonth: cohort.cohortMonth,
    customerCount: cohort.customers.size,
    totalRevenue: cohort.totalRevenue,
  }))

  return cohorts.sort((a, b) => b.cohortMonth.localeCompare(a.cohortMonth))
}
