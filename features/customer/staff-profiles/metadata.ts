import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateStaffProfilesMetadata() {
  return genMeta({
    title: 'Staff Profiles',
    description: 'Browse salon staff profiles, view their specialties, ratings, and availability to book with your preferred stylist.',
    keywords: ['staff profiles', 'stylists', 'hairdressers', 'beauty professionals', 'book stylist', 'staff directory'],
  })
}
