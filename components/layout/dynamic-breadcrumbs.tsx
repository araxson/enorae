'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const LABEL_MAP: Record<string, string> = {
  business: 'Business',
  customer: 'Customer',
  staff: 'Staff',
  admin: 'Admin',
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  analytics: 'Analytics',
  transactions: 'Transactions',
  services: 'Services',
  pricing: 'Pricing',
  categories: 'Categories',
  'booking-rules': 'Booking Rules',
  'product-usage': 'Product Usage',
  inventory: 'Inventory',
  alerts: 'Alerts',
  suppliers: 'Suppliers',
  usage: 'Usage',
  movements: 'Movements',
  locations: 'Locations',
  'purchase-orders': 'Purchase Orders',
  schedules: 'Schedules',
  'operating-hours': 'Operating Hours',
  'blocked-times': 'Blocked Times',
  'time-off': 'Time Off',
  settings: 'Settings',
  salon: 'Salon',
  webhooks: 'Webhooks',
  media: 'Media',
  contact: 'Contact',
  description: 'Description',
  salons: 'Salons',
  favorites: 'Favorites',
  profile: 'Profile',
  reviews: 'Reviews',
  messages: 'Messages',
  preferences: 'Preferences',
  sessions: 'Sessions',
  book: 'Book',
  schedule: 'Schedule',
  clients: 'Clients',
  commission: 'Commission',
  chains: 'Chains',
  metrics: 'Metrics',
}

export function DynamicBreadcrumbs() {
  const pathname = usePathname()

  // Skip breadcrumbs for home/root pages
  if (pathname === '/' || pathname === '/business' || pathname === '/customer' || pathname === '/staff' || pathname === '/admin') {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)

  // Don't show breadcrumbs for single-level pages
  if (segments.length <= 1) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = '/' + segments.slice(0, index + 1).join('/')

          // Use mapped label or format segment
          const label = LABEL_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

          // Skip UUID-like segments (appointment IDs, etc)
          if (segment.match(/^[a-f0-9-]{36}$/i)) {
            return null
          }

          return (
            <div key={segment} className="contents">
              <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className={index === 0 ? 'hidden md:block' : ''} />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
