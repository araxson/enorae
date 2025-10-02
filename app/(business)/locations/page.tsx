import { SalonLocations } from '@/features/salon-locations'
import { getSalonLocations } from '@/features/salon-locations/dal/salon-locations.queries'

export const metadata = {
  title: 'Salon Locations',
  description: 'Manage salon locations and addresses',
}

export default async function SalonLocationsPage() {
  const locations = await getSalonLocations()
  return <SalonLocations initialLocations={locations} />
}
