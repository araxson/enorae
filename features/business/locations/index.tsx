import { getSalonLocations } from './api/queries'
import { SalonLocationsClient } from './components/salon-locations-client'

// Export types
export type * from './types'

export async function SalonLocations() {
  const locations = await getSalonLocations()
  return <SalonLocationsClient initialLocations={locations} />
}
