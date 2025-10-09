import type { NavItem, NavSecondaryItem } from '@/components/layout/sidebars/types'

export const BUSINESS_MENUS = {
  default: [
    { title: 'Dashboard', url: '/business', icon: 'layoutDashboard' },
    { title: 'Appointments', url: '/business/appointments', icon: 'calendar' },
    {
      title: 'Analytics',
      url: '/business/analytics',
      icon: 'barChart3',
      items: [
        { title: 'Overview', url: '/business/analytics' },
        { title: 'Daily Reports', url: '/business/analytics/daily' },
        { title: 'Transactions', url: '/business/analytics/transactions' },
      ],
    },
    { title: 'Reviews', url: '/business/reviews', icon: 'star' },
  ] as NavItem[],
  owner: [
    {
      title: 'Staff',
      url: '/business/staff',
      icon: 'users',
      items: [
        { title: 'Team Members', url: '/business/staff' },
        { title: 'Schedules', url: '/business/staff/schedules' },
        { title: 'Time Off Requests', url: '/business/time-off' },
      ],
    },
    {
      title: 'Services',
      url: '/business/services',
      icon: 'scissors',
      items: [
        { title: 'All Services', url: '/business/services' },
        { title: 'Categories', url: '/business/services/categories' },
        { title: 'Pricing', url: '/business/services/pricing' },
        { title: 'Booking Rules', url: '/business/services/booking-rules' },
        { title: 'Product Usage', url: '/business/services/product-usage' },
      ],
    },
    {
      title: 'Inventory',
      url: '/business/inventory',
      icon: 'package',
      items: [
        { title: 'Overview', url: '/business/inventory' },
        { title: 'Stock Levels', url: '/business/inventory/stock-levels' },
        { title: 'Categories', url: '/business/inventory/categories' },
        { title: 'Purchase Orders', url: '/business/inventory/purchase-orders' },
        { title: 'Suppliers', url: '/business/inventory/suppliers' },
        { title: 'Stock Locations', url: '/business/inventory/locations' },
        { title: 'Movements', url: '/business/inventory/movements' },
        { title: 'Alerts', url: '/business/inventory/alerts' },
        { title: 'Usage Reports', url: '/business/inventory/usage' },
      ],
    },
    { title: 'Operating Hours', url: '/business/operating-hours', icon: 'clock' },
    { title: 'Blocked Times', url: '/business/blocked-times', icon: 'ban' },
    {
      title: 'Metrics',
      url: '/business/metrics',
      icon: 'trendingUp',
      items: [
        { title: 'Overview', url: '/business/metrics' },
        { title: 'Operational', url: '/business/metrics/operational' },
      ],
    },
    {
      title: 'Settings',
      url: '/business/settings/salon',
      icon: 'settings',
      items: [
        { title: 'Salon Info', url: '/business/settings/salon' },
        { title: 'Description', url: '/business/settings/description' },
        { title: 'Contact', url: '/business/settings/contact' },
        { title: 'Media', url: '/business/settings/media' },
        { title: 'Account', url: '/business/settings/account' },
        { title: 'Preferences', url: '/business/settings/preferences' },
        { title: 'Webhooks', url: '/business/settings/webhooks' },
      ],
    },
  ] as NavItem[],
  tenantOwner: [
    { title: 'Locations', url: '/business/locations', icon: 'mapPin' },
  ] as NavItem[],
  secondary: [
    { title: 'Support', url: '/business/support', icon: 'lifeBuoy' },
    { title: 'Help', url: '/business/help', icon: 'helpCircle' },
  ] as NavSecondaryItem[],
} as const
