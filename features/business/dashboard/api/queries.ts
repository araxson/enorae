import 'server-only'
import { cache } from 'react'
import { requireAnyRole, requireUserSalonId, requireAuth, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { SalonView, AppointmentWithDetails } from '@/lib/types/app.types'

// Re-export shared types for backwards compatibility
export type { AppointmentWithDetails } from '@/lib/types/app.types'

/**
 * Get user's salon
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export const getUserSalon = cache(async (): Promise<SalonView> => {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (error) throw error
  return data
})

export const getDashboardMetrics = cache(async (salonId: string) => {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Use Promise.all for parallel execution instead of sequential
  const [
    { data: appointmentsData, error: appointmentsError },
    { data: staff, error: staffError },
    { data: services, error: servicesError }
  ] = await Promise.all([
    supabase.from('appointments').select('status').eq('salon_id', salonId),
    supabase.from('staff').select('id').eq('salon_id', salonId).eq('status', 'active'),
    supabase.from('services').select('id').eq('salon_id', salonId).eq('is_active', true)
  ])

  if (appointmentsError) throw appointmentsError
  if (staffError) throw staffError
  if (servicesError) throw servicesError

  const appointments = (appointmentsData || []) as Array<{ status: string | null }>
  const totalAppointments = appointments.length
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length

  return {
    totalAppointments,
    confirmedAppointments,
    pendingAppointments,
    totalStaff: staff?.length || 0,
    totalServices: services?.length || 0,
  }
})

export const getRecentAppointments = cache(async (salonId: string, limit: number = 5) => {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // IMPROVED: appointments view already includes customer/staff/salon data
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as AppointmentWithDetails[]
})

/**
 * Get user's salon IDs (supports multi-location for tenant owners)
 */
export const getUserSalonIds = cache(async (): Promise<string[]> => {
  const session = await requireAuth()
  const supabase = await createClient()

  // Check if user is a tenant owner with multiple salons
  const { data: tenantData } = await supabase
    .from('salon_chains')
    .select('id')
    .eq('owner_id', session.user.id)
    .maybeSingle()

  if (tenantData) {
    // Get all salons in chain
    const { data: chainSalons } = await supabase
      .from('salons')
      .select('id')
      .eq('chain_id', tenantData.id)

    return chainSalons?.map(s => s.id) || []
  }

  // Otherwise, get user's single salon
  const salonId = await requireUserSalonId()
  return [salonId]
})

/**
 * Get all dashboard data in one optimized call
 * Combines salon, metrics, and appointments to reduce roundtrips
 */
export const getBusinessDashboardData = cache(async () => {
  // SECURITY: Require business user role and get salon ID
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // Fetch all data in parallel
  const [salonResult, appointmentsData, staff, services, recentAppointments] = await Promise.all([
    supabase.from('salons').select('*').eq('id', salonId).single(),
    supabase.from('appointments').select('status').eq('salon_id', salonId),
    supabase.from('staff').select('id').eq('salon_id', salonId).eq('status', 'active'),
    supabase.from('services').select('id').eq('salon_id', salonId).eq('is_active', true),
    supabase
      .from('appointments')
      .select('*')
      .eq('salon_id', salonId)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  if (salonResult.error) throw salonResult.error
  if (appointmentsData.error) throw appointmentsData.error
  if (staff.error) throw staff.error
  if (services.error) throw services.error
  if (recentAppointments.error) throw recentAppointments.error

  const appointments = (appointmentsData.data || []) as Array<{ status: string | null }>

  return {
    salon: salonResult.data,
    metrics: {
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      totalStaff: staff.data?.length || 0,
      totalServices: services.data?.length || 0,
    },
    recentAppointments: (recentAppointments.data || []) as AppointmentWithDetails[],
  }
})

/**
 * Get aggregated metrics across all salons for tenant owners
 */
export const getMultiLocationMetrics = cache(async () => {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonIds = await getUserSalonIds()
  const supabase = await createClient()

  // Get aggregated data across all locations
  const [appointmentsData, staff, services] = await Promise.all([
    supabase.from('appointments').select('status, salon_id').in('salon_id', salonIds),
    supabase.from('staff').select('id, salon_id').in('salon_id', salonIds).eq('status', 'active'),
    supabase.from('services').select('id, salon_id').in('salon_id', salonIds).eq('is_active', true)
  ])

  const appointments = (appointmentsData.data || []) as Array<{ status: string | null; salon_id: string }>

  return {
    totalLocations: salonIds.length,
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    totalStaff: staff.data?.length || 0,
    totalServices: services.data?.length || 0,
  }
})
