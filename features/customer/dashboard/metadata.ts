import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateDashboardMetadata() {
  return genMeta({
    title: 'Customer Dashboard',
    description: 'Your personal dashboard for managing appointments, favorites, loyalty points, and salon preferences.',
    keywords: ['dashboard', 'customer portal', 'my account', 'personal dashboard', 'booking dashboard'],
  })
}
