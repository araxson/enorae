import type { NavItem, NavSecondaryItem } from '@/features/shared/portal-shell/sidebars/types'

export const STAFF_MENUS = {
  default: [
    { title: 'Dashboard', url: '/staff', icon: 'layoutDashboard' },
    { title: 'Notifications', url: '/staff/notifications', icon: 'bell' },
    { title: 'My Appointments', url: '/staff/appointments', icon: 'calendar' },
    { title: 'My Schedule', url: '/staff/schedule', icon: 'clock' },
    { title: 'My Services', url: '/staff/services', icon: 'scissors' },
    { title: 'My Clients', url: '/staff/clients', icon: 'users' },
  ] as NavItem[],
  regular: [
    { title: 'Commission', url: '/staff/commission', icon: 'dollarSign' },
    { title: 'Time Off', url: '/staff/time-off', icon: 'calendarOff' },
  ] as NavItem[],
  senior: [
    {
      title: 'Settings',
      url: '/staff/settings/sessions',
      icon: 'settings',
      items: [
        { title: 'Sessions', url: '/staff/settings/sessions' },
        { title: 'Preferences', url: '/staff/settings/preferences' },
        { title: 'Profile', url: '/staff/profile' },
      ],
    },
  ] as NavItem[],
  secondary: [
    { title: 'Support', url: '/staff/support', icon: 'lifeBuoy' },
    { title: 'Help', url: '/staff/help', icon: 'helpCircle' },
  ] as NavSecondaryItem[],
} as const
