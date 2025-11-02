import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
type SalonChainRecord = Database['organization']['Tables']['salon_chains']['Row']
type SalonRecord = Database['organization']['Tables']['salons']['Row']
type SalonViewRow = Database['public']['Views']['salons_view']['Row']
type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
type ManualTransactionRow = Database['public']['Views']['manual_transactions_view']['Row']
type StaffRow = Database['public']['Views']['staff_enriched_view']['Row']
type ServiceRow = Database['public']['Views']['services_view']['Row']

const REVENUE_TRANSACTION_TYPES: Array<NonNullable<ManualTransactionRow['transaction_type']>> = [
  'service_payment',
  'product_sale',
  'tip',
  'fee',
  'other',
]

export type SalonChainWithCounts = SalonChain

async function getChainSalonRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  chainId: string,
  ownerId: string
): Promise<Array<{ id: string; name: string }>> {
  const { data: chainRecord, error: chainRecordError } = await supabase
    .schema('organization')
    .from('salon_chains')
    .select('id, owner_id, deleted_at')
    .eq('id', chainId)
    .eq('owner_id', ownerId)
    .maybeSingle<Pick<SalonChainRecord, 'id' | 'owner_id' | 'deleted_at'>>()

  if (chainRecordError) throw chainRecordError
  if (!chainRecord || chainRecord.deleted_at !== null) {
    throw new Error('Chain not found or access denied')
  }

  const { data: salonRows, error: salonRowsError } = await supabase
    .schema('organization')
    .from('salons')
    .select('id, name')
    .eq('chain_id', chainId)
    .eq('owner_id', ownerId)
    .is('deleted_at', null)
    .returns<Pick<SalonRecord, 'id' | 'name'>[]>()

  if (salonRowsError) throw salonRowsError

  return (salonRows ?? [])
    .filter((row): row is { id: string; name: string } => Boolean(row.id))
}

/**
 * Get all chains accessible to the user
 * Uses salon_chains_view for pre-computed salon_count and total_staff_count
 */
export async function getSalonChains(): Promise<SalonChain[]> {
  const logger = createOperationLogger('getSalonChains', {})
  logger.start()

  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: ownedChains, error: ownedChainsError } = await supabase
    .schema('organization')
    .from('salon_chains')
    .select('id, deleted_at')
    .eq('owner_id', session.user.id)
    .returns<Pick<SalonChainRecord, 'id' | 'deleted_at'>[]>()

  if (ownedChainsError) throw ownedChainsError

  const chainIds = (ownedChains ?? [])
    .filter(chain => chain.deleted_at === null)
    .map(chain => chain.id)
    .filter((id): id is string => Boolean(id))

  if (chainIds.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .in('id', chainIds)
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []) as SalonChain[]
}

/**
 * Get single salon chain by ID
 */
export async function getSalonChainById(id: string): Promise<SalonChain | null> {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: chainRows } = await supabase
    .schema('organization')
    .from('salon_chains')
    .select('id, owner_id, deleted_at')
    .eq('id', id)
    .eq('owner_id', session.user.id)
    .returns<Pick<SalonChainRecord, 'id' | 'owner_id' | 'deleted_at'>[]>()
    .limit(1)

  const chainRecord = chainRows?.[0]
  if (!chainRecord || chainRecord.deleted_at !== null) {
    return null
  }

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return (data || null) as SalonChain | null
}

/**
 * Get all salons in a specific chain
 */
export async function getChainSalons(chainId: string) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const ownedSalons = await getChainSalonRows(supabase, chainId, session.user.id)
  if (!ownedSalons.length) {
    return []
  }

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .in('id', ownedSalons.map(salon => salon.id))
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []) as SalonViewRow[]
}

/**
 * Get chain-wide analytics aggregated from all locations
 */
export async function getChainAnalytics(chainId: string) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const ownedSalons = await getChainSalonRows(supabase, chainId, session.user.id)
  if (!ownedSalons.length) {
    return {
      totalLocations: 0,
      totalAppointments: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
      totalServices: 0,
      totalStaff: 0,
      locationMetrics: [],
    }
  }

  const salonIds = ownedSalons.map(salon => salon.id)

  const [appointmentsResponse, transactionsResponse, ratingsResponse, staffResponse, servicesResponse] = await Promise.all([
    supabase
      .from('appointments_view')
      .select('id, salon_id')
      .in('salon_id', salonIds)
      .eq('status', 'completed'),
    supabase
      .from('manual_transactions_view')
      .select('salon_id, amount, transaction_type')
      .in('salon_id', salonIds)
      .in('transaction_type', REVENUE_TRANSACTION_TYPES),
    supabase
      .from('salons_view')
      .select('id, name, rating_average, rating_count')
      .in('id', salonIds),
    supabase
      .from('staff_enriched_view')
      .select('salon_id, is_active')
      .in('salon_id', salonIds)
      .eq('is_active', true),
    supabase
      .from('services_view')
      .select('salon_id, is_active')
      .in('salon_id', salonIds)
      .eq('is_active', true),
  ])

  if (appointmentsResponse.error) throw appointmentsResponse.error
  if (transactionsResponse.error) throw transactionsResponse.error
  if (ratingsResponse.error) throw ratingsResponse.error
  if (staffResponse.error) throw staffResponse.error
  if (servicesResponse.error) throw servicesResponse.error

  const appointments = (appointmentsResponse.data ?? []) as AppointmentRow[]
  const transactions = (transactionsResponse.data ?? []) as ManualTransactionRow[]
  const ratingRows = (ratingsResponse.data ?? []) as SalonViewRow[]
  const staffRows = (staffResponse.data ?? []) as StaffRow[]
  const serviceRows = (servicesResponse.data ?? []) as ServiceRow[]

  const revenueBySalon = new Map<string, number>()
  transactions.forEach(tx => {
    if (!tx.salon_id) return
    const amount = Number(tx.amount ?? 0)
    if (!amount) return
    revenueBySalon.set(tx.salon_id, (revenueBySalon.get(tx.salon_id) ?? 0) + amount)
  })

  const ratingBySalon = new Map<string, SalonViewRow>()
  ratingRows.forEach(row => {
    if (row.id) {
      ratingBySalon.set(row.id, row)
    }
  })

  const staffCountBySalon = new Map<string, number>()
  staffRows.forEach(row => {
    if (!row.salon_id) return
    staffCountBySalon.set(row.salon_id, (staffCountBySalon.get(row.salon_id) ?? 0) + 1)
  })

  const serviceCountBySalon = new Map<string, number>()
  serviceRows.forEach(row => {
    if (!row.salon_id) return
    serviceCountBySalon.set(row.salon_id, (serviceCountBySalon.get(row.salon_id) ?? 0) + 1)
  })

  const totalRevenue = Array.from(revenueBySalon.values()).reduce((sum, value) => sum + value, 0)
  const totalAppointments = appointments.length
  const totalServices = serviceRows.length
  const totalStaff = staffRows.length

  const ratingValues = ratingRows
    .map(row => Number(row.rating_average) || 0)
    .filter(value => value > 0)

  const averageRating = ratingValues.length
    ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length
    : 0

  const totalReviews = ratingRows.reduce(
    (sum, row) => sum + (Number(row.rating_count) || 0),
    0
  )

  const locationMetrics = ownedSalons.map(salon => {
    const ratingRow = ratingBySalon.get(salon.id)
    const revenue = revenueBySalon.get(salon.id) ?? 0
    const appointmentCount = appointments.filter(app => app.salon_id === salon.id).length

    return {
      salonId: salon.id,
      salonName: ratingRow?.name || salon.name,
      appointmentCount,
      revenue,
      rating: Number(ratingRow?.rating_average) || 0,
      reviewCount: Number(ratingRow?.rating_count) || 0,
      staffCount: staffCountBySalon.get(salon.id) ?? 0,
      servicesCount: serviceCountBySalon.get(salon.id) ?? 0,
    }
  })

  return {
    totalLocations: ownedSalons.length,
    totalAppointments,
    totalRevenue,
    averageRating,
    totalReviews,
    totalServices,
    totalStaff,
    locationMetrics,
  }
}
