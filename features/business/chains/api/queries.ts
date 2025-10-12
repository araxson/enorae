import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// FIXED: Use salon_chains_view instead of table
type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
export type SalonChainWithCounts = SalonChain

/**
 * Get all chains accessible to the user
 * Uses salon_chains_view for pre-computed salon_count and total_staff_count
 */
export async function getSalonChains(): Promise<SalonChain[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Query the view instead of table - view includes salon_count and total_staff_count
  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('owner_id', session.user.id)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []) as SalonChain[]
}

/**
 * Get single salon chain by ID
 * Uses salon_chains_view for enriched data
 */
export async function getSalonChainById(
  id: string
): Promise<SalonChain | null> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('id', id)
    .eq('owner_id', session.user.id)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as SalonChain
}

/**
 * Get all salons in a specific chain
 */
export async function getChainSalons(chainId: string) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // First verify user owns the chain
  const { data: chain } = await supabase
    .from('salon_chains_view')
    .select('id')
    .eq('id', chainId)
    .eq('owner_id', session.user.id)
    .single()

  if (!chain) throw new Error('Chain not found or access denied')

  // Get all salons in the chain with location details
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('chain_id', chainId)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get chain-wide analytics aggregated from all locations
 */
export async function getChainAnalytics(chainId: string) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify ownership
  const { data: chain } = await supabase
    .from('salon_chains_view')
    .select('id')
    .eq('id', chainId)
    .eq('owner_id', session.user.id)
    .single()

  if (!chain) throw new Error('Chain not found or access denied')

  // Get all salon IDs in chain
  const { data: salonsData } = await supabase
    .from('salons')
    .select('id, name')
    .eq('chain_id', chainId)
    .is('deleted_at', null)

  type SalonBasic = { id: string; name: string }
  const salons = (salonsData || []) as SalonBasic[]

  if (salons.length === 0) {
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

  const salonIds = salons.map((s) => s.id)

  // Get appointments count and revenue
  const { data: appointmentsData } = await supabase
    .from('appointments')
    .select('salon_id, total_amount')
    .in('salon_id', salonIds)
    .eq('status', 'completed')

  type AppointmentData = { salon_id: string; total_amount: number }
  const appointments = (appointmentsData || []) as AppointmentData[]

  // Get ratings and counts
  const { data: ratingsData } = await supabase
    .from('salons')
    .select('id, name, rating, review_count, services_count')
    .in('id', salonIds)

  type SalonData = { id: string; name: string; rating: number; review_count: number; services_count: number }
  const ratings = (ratingsData || []) as SalonData[]

  // Get staff count
  const { data: staffData } = await supabase
    .from('staff')
    .select('salon_id')
    .in('salon_id', salonIds)
    .eq('status', 'active')

  type StaffData = { salon_id: string }
  const staff = (staffData || []) as StaffData[]

  // Aggregate data
  const totalRevenue = appointments.reduce(
    (sum, apt) => sum + (Number(apt.total_amount) || 0),
    0
  )

  const totalAppointments = appointments.length

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, s) => sum + (Number(s.rating) || 0), 0) / ratings.length
    : 0

  const totalReviews = ratings.reduce(
    (sum, s) => sum + (Number(s.review_count) || 0),
    0
  )

  const totalServices = ratings.reduce(
    (sum, s) => sum + (Number(s.services_count) || 0),
    0
  )

  const totalStaff = staff.length

  // Create location-level metrics
  const locationMetrics = salons.map((salon) => {
    const locationAppointments = appointments.filter(
      (a) => a.salon_id === salon.id
    )
    const locationRating = ratings.find((r) => r.id === salon.id)
    const locationStaffCount = staff.filter(
      (s) => s.salon_id === salon.id
    ).length

    return {
      salonId: salon.id,
      salonName: salon.name,
      appointmentCount: locationAppointments.length,
      revenue: locationAppointments.reduce(
        (sum, apt) => sum + (Number(apt.total_amount) || 0),
        0
      ),
      rating: Number(locationRating?.rating) || 0,
      reviewCount: Number(locationRating?.review_count) || 0,
      servicesCount: Number(locationRating?.services_count) || 0,
      staffCount: locationStaffCount,
    }
  })

  return {
    totalLocations: salons.length,
    totalAppointments,
    totalRevenue,
    averageRating: avgRating,
    totalReviews,
    totalServices,
    totalStaff,
    locationMetrics,
  }
}