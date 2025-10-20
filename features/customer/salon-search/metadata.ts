import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateSalonSearchMetadata() {
  return genMeta({
    title: 'Search Salons',
    description: 'Advanced salon search with filters for location, services, ratings, price range, and availability.',
    keywords: ['salon search', 'find salons', 'advanced search', 'salon filters', 'search by location', 'nearby salons'],
  })
}
