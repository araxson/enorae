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

  try {
    // Use Promise.all for parallel execution instead of sequential
    const [appointmentsResult, staffResult, servicesResult] = await Promise.all([
      supabase.from('appointments').select('status').eq('salon_id', salonId),
      supabase.from('staff').select('id').eq('salon_id', salonId),
      supabase.from('services').select('id').eq('salon_id', salonId).eq('is_active', true)
    ])

    // Check for errors but continue with partial data if available
    if (appointmentsResult.error) {
      console.error('[getDashboardMetrics] Appointments error:', appointmentsResult.error)
    }
    if (staffResult.error) {
      console.error('[getDashboardMetrics] Staff error:', staffResult.error)
    }
    if (servicesResult.error) {
      console.error('[getDashboardMetrics] Services error:', servicesResult.error)
    }

    const appointments = (appointmentsResult.data || []) as Array<{ status: string | null }>
    const totalAppointments = appointments.length
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length

    return {
      totalAppointments,
      confirmedAppointments,
      pendingAppointments,
      totalStaff: staffResult.data?.length || 0,
      totalServices: servicesResult.data?.length || 0,
    }
  } catch (error) {
    console.error('[getDashboardMetrics] Unexpected error:', error)
    // Return zero metrics on error instead of throwing
    return {
      totalAppointments: 0,
      confirmedAppointments: 0,
      pendingAppointments: 0,
      totalStaff: 0,
      totalServices: 0,
    }
  }
})

export const getRecentAppointments = cache(async (salonId: string, limit: number = 5) => {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  try {
    // IMPROVED: appointments view already includes customer/staff/salon data
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('salon_id', salonId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[getRecentAppointments] Query error:', error)
      return []
    }

    return (data || []) as AppointmentWithDetails[]
  } catch (error) {
    console.error('[getRecentAppointments] Unexpected error:', error)
    return []
  }
})

/**
 * Get user's salon IDs (supports multi-location for tenant owners)
 */
export const getUserSalonIds = cache(async (): Promise<string[]> => {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Check if user is a tenant owner with multiple salons
    const { data: tenantData, error: tenantError } = await supabase
      .from('salon_chains')
      .select('id')
      .eq('owner_id', session.user.id)
      .maybeSingle()

    if (tenantError) {
      console.error('[getUserSalonIds] Tenant query error:', tenantError)
    }

    const chain = tenantData as { id: string } | null

    if (chain) {
      // Get all salons in chain
      const { data: chainSalons, error: chainError } = await supabase
        .from('salons')
        .select('id')
        .eq('chain_id', chain.id)

      if (chainError) {
        console.error('[getUserSalonIds] Chain salons query error:', chainError)
        return []
      }

      const salons = (chainSalons || []) as Array<{ id: string }>
      return salons.map(s => s.id)
    }

    // Otherwise, get user's single salon
    const salonId = await requireUserSalonId()
    return [salonId]
  } catch (error) {
    console.error('[getUserSalonIds] Unexpected error:', error)
    return []
  }
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

  try {
    // Handle case where user has no salons
    if (!salonIds || salonIds.length === 0) {
      return {
        totalLocations: 0,
        totalAppointments: 0,
        confirmedAppointments: 0,
        pendingAppointments: 0,
        totalStaff: 0,
        totalServices: 0,
      }
    }

    // Get aggregated data across all locations
    const [appointmentsResult, staffResult, servicesResult] = await Promise.all([
      supabase.from('appointments').select('status, salon_id').in('salon_id', salonIds),
      supabase.from('staff').select('id, salon_id').in('salon_id', salonIds),
      supabase.from('services').select('id, salon_id').in('salon_id', salonIds).eq('is_active', true)
    ])

    if (appointmentsResult.error) {
      console.error('[getMultiLocationMetrics] Appointments error:', appointmentsResult.error)
    }
    if (staffResult.error) {
      console.error('[getMultiLocationMetrics] Staff error:', staffResult.error)
    }
    if (servicesResult.error) {
      console.error('[getMultiLocationMetrics] Services error:', servicesResult.error)
    }

    const appointments = (appointmentsResult.data || []) as Array<{ status: string | null; salon_id: string }>

    return {
      totalLocations: salonIds.length,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      totalStaff: staffResult.data?.length || 0,
      totalServices: servicesResult.data?.length || 0,
    }
  } catch (error) {
    console.error('[getMultiLocationMetrics] Unexpected error:', error)
    return {
      totalLocations: 0,
      totalAppointments: 0,
      confirmedAppointments: 0,
      pendingAppointments: 0,
      totalStaff: 0,
      totalServices: 0,
    }
  }
})
