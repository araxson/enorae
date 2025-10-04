import 'server-only'
import { cache } from 'react'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { AppointmentWithDetails, CustomerFavoriteView } from '@/lib/types/app.types'
import { getDateRanges } from '@/lib/utils/dates'

export const getUpcomingAppointments = cache(async (): Promise<AppointmentWithDetails[]> => {
  // SECURITY: Use requireAuth() - validates with Supabase servers
  const session = await requireAuth()
  const supabase = await createClient()

  const now = new Date().toISOString()

  // IMPROVED: appointments view already includes salon/staff/service data
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', session.user.id)
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(5)

  if (error) throw error
  return data || []
})

export const getPastAppointments = cache(async (): Promise<AppointmentWithDetails[]> => {
  // SECURITY: Use requireAuth() - validates with Supabase servers
  const session = await requireAuth()
  const supabase = await createClient()

  const now = new Date().toISOString()

  // IMPROVED: appointments view already includes salon/staff/service data
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', session.user.id)
    .lt('start_time', now)
    .order('start_time', { ascending: false })
    .limit(5)

  if (error) throw error
  return data || []
})

export const getFavorites = cache(async (): Promise<CustomerFavoriteView[]> => {
  // SECURITY: Use requireAuth() - validates with Supabase servers
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_favorites')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
})

export const getCustomerMetrics = cache(async () => {
  // SECURITY: Use requireAuth() - validates with Supabase servers
  const session = await requireAuth()
  const supabase = await createClient()

  const now = new Date().toISOString()

  // Use Promise.all for parallel execution
  const [
    { count: upcomingCount },
    { count: completedCount },
    { count: favoritesCount }
  ] = await Promise.all([
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', session.user.id)
      .gte('start_time', now),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', session.user.id)
      .eq('status', 'completed'),
    supabase
      .from('customer_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', session.user.id)
  ])

  return {
    upcomingAppointments: upcomingCount || 0,
    completedAppointments: completedCount || 0,
    favorites: favoritesCount || 0,
  }
})

/**
 * Check if customer is VIP and get VIP-specific data
 * Handles guest users gracefully
 */
export const getVIPStatus = cache(async () => {
  const session = await requireAuth()
  const supabase = await createClient()

  // Check if VIP customer
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (roleError && roleError.code !== 'PGRST116') throw roleError // Ignore "not found" errors

  const userRole = roleData as { role: string } | null

  // GUEST HANDLING: Return default for guest users
  if (!userRole || userRole.role === 'guest') {
    return {
      isVIP: false,
      isGuest: true,
      loyaltyPoints: 0,
      loyaltyTier: null,
      lifetimeSpend: 0,
      memberSince: null,
    }
  }

  const isVIP = userRole.role === 'vip_customer'

  if (!isVIP) {
    return {
      isVIP: false,
      isGuest: false,
      loyaltyPoints: 0,
      loyaltyTier: null,
      lifetimeSpend: 0,
      memberSince: null,
    }
  }

  const { month } = getDateRanges()

  // Get VIP-specific metrics
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('total_price, created_at')
    .eq('customer_id', session.user.id)
    .eq('status', 'completed')

  if (appointmentsError) throw appointmentsError

  const appointmentList = (appointments || []) as Array<{ total_price: number | null; created_at: string | null }>

  const lifetimeSpend = appointmentList.reduce((sum, apt) => sum + (apt.total_price || 0), 0)
  const monthlySpend = appointmentList
    .filter((apt) => apt.created_at && apt.created_at >= month.start)
    .reduce((sum, apt) => sum + (apt.total_price || 0), 0)

  // Calculate loyalty tier based on spending
  let loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze'
  if (lifetimeSpend >= 5000) loyaltyTier = 'platinum'
  else if (lifetimeSpend >= 2000) loyaltyTier = 'gold'
  else if (lifetimeSpend >= 500) loyaltyTier = 'silver'

  // Calculate loyalty points (1 point per $10 spent)
  const loyaltyPoints = Math.floor(lifetimeSpend / 10)

  return {
    isVIP: true,
    isGuest: false,
    loyaltyPoints,
    loyaltyTier,
    lifetimeSpend,
    monthlySpend,
    memberSince: appointmentList[appointmentList.length - 1]?.created_at || null,
  }
})

/**
 * Check if user is a guest
 */
export const checkGuestRole = cache(async () => {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (roleError && roleError.code !== 'PGRST116') throw roleError // Ignore "not found" errors

  const userRole = roleData as { role: string } | null

  return {
    isGuest: !userRole || userRole.role === 'guest',
    role: userRole?.role || 'guest',
  }
})
