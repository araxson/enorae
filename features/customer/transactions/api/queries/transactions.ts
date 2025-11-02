import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type ManualTransactionRow =
  Database['public']['Views']['manual_transactions_view']['Row']

type SalonSummaryRow = Pick<
  Database['public']['Views']['salons_view']['Row'],
  'id' | 'name'
>
type StaffSummaryRow = {
  id: string
  full_name?: string | null
}
type AppointmentSummaryRow = Pick<
  Database['public']['Views']['appointments_view']['Row'],
  'id' | 'start_time'
>

type SalonSummary = { id: string; name: string | null }
type StaffSummary = { id: string; full_name: string | null }
type AppointmentSummary = { id: string; start_time: string | null }

export type CustomerTransactionWithDetails = ManualTransactionRow & {
  salon: SalonSummary | null
  staff: StaffSummary | null
  appointment: AppointmentSummary | null
}

/**
 * Get all transactions for the current customer
 */
export async function getCustomerTransactions(): Promise<CustomerTransactionWithDetails[]> {
  const logger = createOperationLogger('getCustomerTransactions', {})
  logger.start()

  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('manual_transactions_view')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('transaction_at', { ascending: false })
    .returns<ManualTransactionRow[]>()

  if (error) throw error

  const transactions = data ?? []

  const salonIds = Array.from(
    new Set(
      transactions
        .map((txn) => txn.salon_id)
        .filter((id): id is string => typeof id === 'string')
    )
  )
  const staffIds = Array.from(
    new Set(
      transactions
        .map((txn) => txn.staff_id)
        .filter((id): id is string => typeof id === 'string')
    )
  )
  const appointmentIds = Array.from(
    new Set(
      transactions
        .map((txn) => txn.appointment_id)
        .filter((id): id is string => typeof id === 'string')
    )
  )

  const salonMap = new Map<string, SalonSummary>()
  if (salonIds.length > 0) {
    const { data: salons, error: salonsError } = await supabase
      .from('salons_view')
      .select('id, name')
      .in('id', salonIds)

    if (salonsError) throw salonsError
    for (const salon of (salons ?? []) as SalonSummaryRow[]) {
      if (salon.id) {
        salonMap.set(salon.id, { id: salon.id, name: salon.name ?? null })
      }
    }
  }

  const staffMap = new Map<string, StaffSummary>()
  if (staffIds.length > 0) {
    const { data: staff, error: staffError } = await supabase
      .from('staff_profiles_view')
      .select('id, title')
      .in('id', staffIds)
      .returns<Array<{ id: string; title: string | null }>>()

    if (staffError) throw staffError
    for (const member of (staff ?? [])) {
      if (member.id) {
        staffMap.set(member.id, {
          id: member.id,
          full_name: member.title ?? null,
        })
      }
    }
  }

  const appointmentMap = new Map<string, AppointmentSummary>()
  if (appointmentIds.length > 0) {
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments_view')
      .select('id, start_time')
      .in('id', appointmentIds)

    if (appointmentsError) throw appointmentsError
    for (const appointment of (appointments ?? []) as AppointmentSummaryRow[]) {
      if (appointment.id) {
        appointmentMap.set(appointment.id, {
          id: appointment.id,
          start_time: appointment.start_time ?? null,
        })
      }
    }
  }

  return transactions.map((transaction) => ({
    ...transaction,
    salon: transaction.salon_id
      ? salonMap.get(transaction.salon_id) ?? { id: transaction.salon_id, name: null }
      : null,
    staff: transaction.staff_id
      ? staffMap.get(transaction.staff_id) ?? { id: transaction.staff_id, full_name: null }
      : null,
    appointment: transaction.appointment_id
      ? appointmentMap.get(transaction.appointment_id) ?? {
          id: transaction.appointment_id,
          start_time: null,
        }
      : null,
  }))
}

/**
 * Get a specific transaction by ID
 */
export async function getCustomerTransactionById(
  id: string
): Promise<CustomerTransactionWithDetails | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('manual_transactions_view')
    .select('*')
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .maybeSingle<ManualTransactionRow>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  if (!data) return null

  const [salonSummary, staffSummary, appointmentSummary] = await Promise.all([
    data.salon_id
      ? supabase
          .from('salons_view')
          .select('id, name')
          .eq('id', data.salon_id)
          .limit(1)
          .maybeSingle<SalonSummaryRow>()
      : Promise.resolve({ data: null as SalonSummaryRow | null, error: null }),
    data.staff_id
      ? supabase
          .from('staff_profiles_view')
          .select('id, title')
          .eq('id', data.staff_id)
          .limit(1)
          .maybeSingle<{ id: string; title: string | null }>()
      : Promise.resolve({ data: null, error: null }),
    data.appointment_id
      ? supabase
          .from('appointments_view')
          .select('id, start_time')
          .eq('id', data.appointment_id)
          .limit(1)
          .maybeSingle<AppointmentSummaryRow>()
      : Promise.resolve({ data: null as AppointmentSummaryRow | null, error: null }),
  ])

  if (salonSummary.error) throw salonSummary.error
  if (staffSummary.error) throw staffSummary.error
  if (appointmentSummary.error) throw appointmentSummary.error

  return {
    ...data,
    salon: data.salon_id
      ? salonSummary.data && salonSummary.data.id
        ? { id: salonSummary.data.id, name: salonSummary.data.name ?? null }
        : { id: data.salon_id, name: null }
      : null,
    staff: data.staff_id
      ? staffSummary.data && staffSummary.data.id
        ? { id: staffSummary.data.id, full_name: staffSummary.data.title ?? null }
        : { id: data.staff_id, full_name: null }
      : null,
    appointment: data.appointment_id
      ? appointmentSummary.data && appointmentSummary.data.id
        ? {
            id: appointmentSummary.data.id,
            start_time: appointmentSummary.data.start_time ?? null,
          }
        : {
            id: data.appointment_id,
            start_time: null,
          }
      : null,
  }
}
