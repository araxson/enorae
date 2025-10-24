import { SalonLocations } from '@/features/business/locations'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Salon Locations',
  description: 'Manage salon locations, addresses, and contact details',
  noIndex: true,
})

export default async function SalonLocationsPage() {
  return <SalonLocations />
}
