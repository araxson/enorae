'use server'

import { verifySession } from '@/lib/auth/session'
import { ROLE_GROUPS, type RoleType } from './roles'
import { logAuthEvent } from '@/lib/observability/logger'

export async function hasRole(role: RoleType): Promise<boolean> {
  const session = await verifySession()
  const hasAccess = session?.role === role

  logAuthEvent('permission_check', {
    operationName: 'hasRole',
    userId: session?.user.id,
    reason: `Checking role: ${role}`,
    success: hasAccess,
  })

  return hasAccess
}

export async function hasAnyRole(roles: RoleType[]): Promise<boolean> {
  const session = await verifySession()
  return session ? roles.includes(session.role) : false
}

export async function isPlatformAdmin(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}

export async function isBusinessUser(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.BUSINESS_USERS)
}

export async function isStaffUser(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.STAFF_USERS)
}

export async function isCustomer(): Promise<boolean> {
  return hasAnyRole(ROLE_GROUPS.CUSTOMER_USERS)
}

export async function getStaffRoleLevel(): Promise<'junior' | 'regular' | 'senior' | null> {
  const session = await verifySession()
  if (!session) return null

  if (session.role === 'junior_staff') return 'junior'
  if (session.role === 'staff') return 'regular'
  if (session.role === 'senior_staff') return 'senior'

  return null
}

export async function isSeniorStaff(): Promise<boolean> {
  const session = await verifySession()
  return session?.role === 'senior_staff'
}
