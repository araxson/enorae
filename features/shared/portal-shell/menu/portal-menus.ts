import { ADMIN_MENUS } from './admin-menus'
import { BUSINESS_MENUS } from './business-menus'
import { CUSTOMER_MENUS } from './customer-menus'
import { STAFF_MENUS } from './staff-menus'

export { ADMIN_MENUS } from './admin-menus'
export { BUSINESS_MENUS } from './business-menus'
export { CUSTOMER_MENUS } from './customer-menus'
export { STAFF_MENUS } from './staff-menus'

export const PORTAL_MENUS = {
  admin: ADMIN_MENUS,
  business: BUSINESS_MENUS,
  customer: CUSTOMER_MENUS,
  staff: STAFF_MENUS,
} as const
