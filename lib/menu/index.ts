/**
 * Portal navigation menus barrel file
 * Exports menu structures for all portals and the menu generation utility
 *
 * Usage:
 *   import { getMenuForUser, PORTAL_MENUS } from '@/lib/menu'
 *   import { ADMIN_MENUS, BUSINESS_MENUS } from '@/lib/menu'
 */

// Menu generation utility
export { getMenuForUser, type MenuResult } from './get-menu-for-user'

// Portal menu structures
export { PORTAL_MENUS } from './portal-menus'
export { ADMIN_MENUS } from './admin-menus'
export { BUSINESS_MENUS } from './business-menus'
export { CUSTOMER_MENUS } from './customer-menus'
export { STAFF_MENUS } from './staff-menus'
