'use server'

import { PORTAL_MENUS } from './portal-menus'
import { verifySession, type Session } from '@/lib/auth/session'
import type { NavItem, NavSecondaryItem } from '@/components/layout/sidebars/types'

type PortalType = keyof typeof PORTAL_MENUS

interface MenuResult {
  navMain: NavItem[]
  navSecondary: NavSecondaryItem[]
}

/**
 * Get filtered menu items for current user based on their role
 *
 * @param portal - Portal type (admin, business, staff, customer)
 * @param sessionOverride - Optional pre-fetched session to avoid duplicate lookups
 * @returns Filtered navigation items
 */
export async function getMenuForUser(
  portal: PortalType,
  sessionOverride?: Session | null,
): Promise<MenuResult> {
  const session = sessionOverride ?? (await verifySession())

  if (!session) {
    return { navMain: [], navSecondary: [] }
  }

  const menus = PORTAL_MENUS[portal]
  const items: NavItem[] = [...menus.default]

  // Add role-specific items based on portal
  switch (portal) {
    case 'admin': {
      const adminMenus = PORTAL_MENUS.admin
      if (session.role === 'platform_admin' || session.role === 'super_admin') {
        items.push(...adminMenus.platformAdmin)
      }
      if (session.role === 'super_admin') {
        items.push(...adminMenus.superAdmin)
      }
      break
    }

    case 'business': {
      const businessMenus = PORTAL_MENUS.business
      // Tenant owner gets all owner features + multi-location
      if (session.role === 'tenant_owner') {
        items.push(...businessMenus.owner)
        items.push(...businessMenus.tenantOwner)
      }
      // Salon owner and manager get standard owner features
      else if (session.role === 'salon_owner' || session.role === 'salon_manager') {
        items.push(...businessMenus.owner)
      }
      break
    }

    case 'staff': {
      const staffMenus = PORTAL_MENUS.staff
      // Regular and senior staff get commission and time off
      if (session.role === 'staff' || session.role === 'senior_staff') {
        items.push(...staffMenus.regular)
      }
      // Senior staff get additional settings
      if (session.role === 'senior_staff') {
        items.push(...staffMenus.senior)
      }
      // Junior staff only get default items (no commission/time off)
      break
    }

    case 'customer':
      // All customers get same menu
      // VIP features can be added here if needed
      break
  }

  return {
    navMain: items,
    navSecondary: menus.secondary || [],
  }
}
