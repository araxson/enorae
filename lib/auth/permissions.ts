/**
 * Permission Helper Functions
 *
 * SECURITY NOTE:
 * All functions use verifySession() from session.ts
 * which validates auth with Supabase servers (secure)
 */

import 'server-only'
import { verifySession } from './session'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type RoleType = Database['public']['Enums']['role_type']

// Role hierarchy - defines which routes each role can access
export const ROLE_HIERARCHY: Record<string, string[]> = {
  // Platform roles (highest) - can access all portals
  super_admin: ['/admin', '/business', '/staff', '/customer', '/profile', '/book'],
  platform_admin: ['/admin', '/business', '/staff', '/customer', '/profile'],

  // Business roles - can access business and staff portals
  tenant_owner: ['/business', '/staff', '/profile'],
  salon_owner: ['/business', '/staff', '/profile'],
  salon_manager: ['/business', '/profile'],

  // Staff roles - can access staff portal and customer features
  senior_staff: ['/staff', '/profile', '/book'],
  staff: ['/staff', '/profile', '/book'],
  junior_staff: ['/staff', '/profile'],

  // Customer roles - can access customer features only
  vip_customer: ['/customer', '/profile', '/book'],
  customer: ['/customer', '/profile', '/book'],
  guest: ['/customer', '/book'],
}

// Default landing page for each role
export const DEFAULT_ROUTES: Record<string, string> = {
  super_admin: '/admin',
  platform_admin: '/admin',
  tenant_owner: '/business',
  salon_owner: '/business',
  salon_manager: '/business',
  senior_staff: '/staff',
  staff: '/staff',
  junior_staff: '/staff',
  vip_customer: '/customer',
  customer: '/customer',
  guest: '/explore',
}

// Role groups for permission checking
export const ROLE_GROUPS = {
  PLATFORM_ADMINS: ['super_admin', 'platform_admin'] as RoleType[],
  BUSINESS_USERS: ['tenant_owner', 'salon_owner', 'salon_manager'] as RoleType[],
  STAFF_USERS: ['senior_staff', 'staff', 'junior_staff'] as RoleType[],
  CUSTOMER_USERS: ['vip_customer', 'customer', 'guest'] as RoleType[],
  SALON_MANAGERS: ['salon_owner', 'salon_manager'] as RoleType[],
  ALL_STAFF: ['senior_staff', 'staff', 'junior_staff', 'salon_owner', 'salon_manager'] as RoleType[],
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: RoleType): Promise<boolean> {
  const session = await verifySession()
  return session?.role === role
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: RoleType[]): Promise<boolean> {
  const session = await verifySession()
  return session ? roles.includes(session.role) : false
}

/**
 * Check if the current user is a platform admin
 */
export async function isPlatformAdmin(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}

/**
 * Check if the current user is a business user
 */
export async function isBusinessUser(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.BUSINESS_USERS)
}

/**
 * Check if the current user is a staff member
 */
export async function isStaffUser(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.STAFF_USERS)
}

/**
 * Get staff role level (junior, regular, senior)
 * Returns null if user is not staff
 */
export async function getStaffRoleLevel(): Promise<'junior' | 'regular' | 'senior' | null> {
  const session = await verifySession()
  if (!session) return null

  if (session.role === 'junior_staff') return 'junior'
  if (session.role === 'staff') return 'regular'
  if (session.role === 'senior_staff') return 'senior'

  return null
}

/**
 * Check if staff user has senior privileges
 */
export async function isSeniorStaff(): Promise<boolean> {
  const session = await verifySession()
  return session?.role === 'senior_staff'
}

/**
 * Check if the current user is a customer
 */
export async function isCustomer(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.CUSTOMER_USERS)
}

/**
 * Check if user can access a specific route
 */
export async function canAccessRoute(route: string): Promise<boolean> {
  const session = await verifySession()
  if (!session) return false

  const allowedRoutes = ROLE_HIERARCHY[session.role] || []
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute))
}

/**
 * Get the default route for the current user
 */
export async function getDefaultRoute(): Promise<string> {
  const session = await verifySession()
  return session ? DEFAULT_ROUTES[session.role] || '/' : '/'
}

/**
 * Get user's salon ID (for staff and business users)
 * Uses secure verifySession
 * Returns null if user has no salon association
 */
export async function getUserSalonId(): Promise<string | null> {
  const session = await verifySession()
  if (!session) return null

  const supabase = await createClient()

  // IMPORTANT: Check salon ownership FIRST (business users)
  // Then check staff membership (staff might also own salons)
  const { data: ownedSalon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .maybeSingle<{ id: string }>()

  if (ownedSalon?.id) {
    return ownedSalon.id
  }

  // Check if user is a staff member
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .maybeSingle<{ salon_id: string | null }>()

  return staffProfile?.salon_id || null
}

/**
 * Get user's salon ID or throw error if not found
 * Use this in business portal queries that require a salon
 */
export async function requireUserSalonId(): Promise<string> {
  const salonId = await getUserSalonId()

  if (!salonId) {
    throw new Error(
      'No salon found. Please ensure your account is properly set up with a salon or contact support.'
    )
  }

  return salonId
}

/**
 * Check if user has access to a specific salon
 * Uses secure verifySession
 */
export async function canAccessSalon(salonId: string): Promise<boolean> {
  const session = await verifySession()
  if (!session) return false

  // Platform admins can access all salons
  if (await isPlatformAdmin()) return true

  const supabase = await createClient()

  // Check if user owns this salon
  const { data: salonData } = await supabase
    .from('salons')
    .select('id')
    .eq('id', salonId)
    .eq('owner_id', session.user.id)
    .single()

  if (salonData) return true

  // Check if user is staff at this salon
  const { data: staffData } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('salon_id', salonId)
    .single()

  return !!staffData
}
