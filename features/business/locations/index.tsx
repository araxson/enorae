import { getSalonLocations } from './api/queries'
import { SalonLocationsClient } from './components/salon-locations-client'
import type { SalonLocationView } from '@/lib/types/view-extensions'

export async function SalonLocations() {
  const locations = await getSalonLocations() as SalonLocationView[]
  return <SalonLocationsClient initialLocations={locations} />
}
