/**
 * Application Routes and Navigation
 *
 * Portal-specific navigation links and route definitions
 */

/**
 * Navigation Links by Portal
 */
export const NAV_LINKS = {
  CUSTOMER: [
    { href: '/salons', label: 'Browse Salons' },
    { href: '/profile', label: 'My Profile' },
  ],
  BUSINESS: [
    { href: '/business', label: 'Dashboard' },
    { href: '/business/appointments', label: 'Appointments' },
    { href: '/business/staff', label: 'Staff' },
    { href: '/business/services', label: 'Services' },
  ],
  STAFF: [
    { href: '/staff', label: 'My Schedule' },
    { href: '/staff/appointments', label: 'Appointments' },
  ],
  ADMIN: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/salons', label: 'Salons' },
    { href: '/admin/users', label: 'Users' },
  ],
} as const
