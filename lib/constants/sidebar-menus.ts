'use client'

import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  Clock,
  MapPin,
  Settings,
  BarChart3,
  Ban,
  Building2,
  Home,
  Heart,
  Store,
  MessageSquare,
  User,
  Star,
  DollarSign,
  CalendarOff,
} from 'lucide-react'
import type { MenuSection } from '@/components/layout/portal-sidebar'

// ============================================================================
// ADMIN PORTAL
// ============================================================================

export const ADMIN_SIDEBAR_SECTIONS: MenuSection[] = [
  {
    label: 'Platform Management',
    items: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        url: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Overview',
    items: [
      {
        title: 'Appointments',
        url: '/admin/appointments',
        icon: Calendar,
      },
      {
        title: 'Reviews',
        url: '/admin/reviews',
        icon: Star,
      },
      {
        title: 'Inventory',
        url: '/admin/inventory',
        icon: Package,
      },
      {
        title: 'Messages',
        url: '/admin/messages',
        icon: MessageSquare,
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        title: 'Salon Chains',
        url: '/admin/chains',
        icon: Building2,
      },
      {
        title: 'Users',
        url: '/admin/users',
        icon: Users,
      },
      {
        title: 'Settings',
        url: '/admin/settings',
        icon: Settings,
      },
    ],
  },
]

// ============================================================================
// BUSINESS PORTAL
// ============================================================================

export const BUSINESS_SIDEBAR_SECTIONS: MenuSection[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/business/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Appointments',
        url: '/business/appointments',
        icon: Calendar,
      },
      {
        title: 'Analytics',
        url: '/business/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Staff',
        url: '/business/staff',
        icon: Users,
      },
      {
        title: 'Services',
        url: '/business/services',
        icon: Scissors,
      },
      {
        title: 'Inventory',
        url: '/business/inventory',
        icon: Package,
      },
      {
        title: 'Locations',
        url: '/business/locations',
        icon: MapPin,
      },
      {
        title: 'Operating Hours',
        url: '/business/operating-hours',
        icon: Clock,
      },
      {
        title: 'Blocked Times',
        url: '/business/blocked-times',
        icon: Ban,
      },
    ],
  },
  {
    label: 'Configuration',
    items: [
      {
        title: 'Settings',
        url: '/business/settings/salon',
        icon: Settings,
      },
    ],
  },
]

// ============================================================================
// CUSTOMER PORTAL
// ============================================================================

export const CUSTOMER_SIDEBAR_SECTIONS: MenuSection[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Home',
        url: '/customer',
        icon: Home,
      },
      {
        title: 'Browse Salons',
        url: '/customer/salons',
        icon: Store,
      },
      {
        title: 'My Appointments',
        url: '/customer/appointments',
        icon: Calendar,
      },
    ],
  },
  {
    label: 'Personal',
    items: [
      {
        title: 'Favorites',
        url: '/customer/favorites',
        icon: Heart,
      },
      {
        title: 'Reviews',
        url: '/customer/reviews',
        icon: Star,
      },
      {
        title: 'Messages',
        url: '/customer/messages',
        icon: MessageSquare,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Profile',
        url: '/customer/profile',
        icon: User,
      },
      {
        title: 'Settings',
        url: '/customer/settings/preferences',
        icon: Settings,
      },
    ],
  },
]

// ============================================================================
// STAFF PORTAL
// ============================================================================

export const STAFF_SIDEBAR_SECTIONS: MenuSection[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Dashboard',
        url: '/staff',
        icon: LayoutDashboard,
      },
      {
        title: 'My Appointments',
        url: '/staff/appointments',
        icon: Calendar,
      },
      {
        title: 'My Schedule',
        url: '/staff/schedule',
        icon: Clock,
      },
    ],
  },
  {
    label: 'Work',
    items: [
      {
        title: 'My Services',
        url: '/staff/services',
        icon: Scissors,
      },
      {
        title: 'My Clients',
        url: '/staff/clients',
        icon: Users,
      },
      {
        title: 'Commission',
        url: '/staff/commission',
        icon: DollarSign,
      },
      {
        title: 'Time Off',
        url: '/staff/time-off',
        icon: CalendarOff,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Profile',
        url: '/staff/profile',
        icon: User,
      },
      {
        title: 'Settings',
        url: '/staff/settings/sessions',
        icon: Settings,
      },
    ],
  },
]
