import type { NavItem, NavSecondaryItem } from '@/components/layout/sidebars/types'

export const ADMIN_MENUS = {
  default: [
    { title: 'Dashboard', url: '/admin', icon: 'layoutDashboard' },
    { title: 'Analytics', url: '/admin/analytics', icon: 'barChart3' },
    { title: 'Appointments', url: '/admin/appointments', icon: 'calendar' },
    { title: 'Reviews', url: '/admin/reviews', icon: 'star' },
  ] as NavItem[],
  platformAdmin: [
    { title: 'Salons', url: '/admin/salons', icon: 'store' },
    { title: 'Salon Chains', url: '/admin/chains', icon: 'building2' },
    { title: 'Users', url: '/admin/users', icon: 'users' },
    { title: 'Roles', url: '/admin/roles', icon: 'shield' },
    { title: 'Inventory', url: '/admin/inventory', icon: 'package' },
    { title: 'Moderation', url: '/admin/moderation', icon: 'shieldAlert' },
    { title: 'Security', url: '/admin/security', icon: 'lock' },
  ] as NavItem[],
  superAdmin: [
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: 'settings',
      items: [
        { title: 'General', url: '/admin/settings' },
        { title: 'Preferences', url: '/admin/settings/preferences' },
        { title: 'Profile', url: '/admin/profile' },
      ],
    },
  ] as NavItem[],
  secondary: [
    { title: 'Support', url: '/admin/support', icon: 'lifeBuoy' },
    { title: 'Help', url: '/admin/help', icon: 'helpCircle' },
  ] as NavSecondaryItem[],
} as const
