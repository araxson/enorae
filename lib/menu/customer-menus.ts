import type { NavItem, NavSecondaryItem } from '@/features/shared/portal-shell/types'

export const CUSTOMER_MENUS = {
  default: [
    { title: 'Home', url: '/customer', icon: 'home' },
    { title: 'Browse Salons', url: '/customer/salons', icon: 'store' },
    { title: 'Salon Chains', url: '/customer/chains', icon: 'building2' },
    { title: 'My Appointments', url: '/customer/appointments', icon: 'calendar' },
    { title: 'Transactions', url: '/customer/transactions', icon: 'receipt' },
    { title: 'Analytics', url: '/customer/analytics', icon: 'barChart3' },
    { title: 'Favorites', url: '/customer/favorites', icon: 'heart' },
    { title: 'Reviews', url: '/customer/reviews', icon: 'star' },
    { title: 'Messages', url: '/customer/messages', icon: 'messageSquare' },
    { title: 'Profile', url: '/customer/profile', icon: 'user' },
    {
      title: 'Settings',
      url: '/customer/settings/preferences',
      icon: 'settings',
      items: [
        { title: 'Preferences', url: '/customer/settings/preferences' },
        { title: 'Sessions', url: '/customer/settings/sessions' },
      ],
    },
  ] as NavItem[],
  secondary: [
    { title: 'Support', url: '/customer/support', icon: 'lifeBuoy' },
    { title: 'Help', url: '/customer/help', icon: 'helpCircle' },
  ] as NavSecondaryItem[],
} as const
