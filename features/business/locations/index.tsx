import { getSalonLocations } from './api/queries'
import { SalonLocationsClient } from './components'

// Export types
export type * from './api/types'

export async function SalonLocations() {
  const locations = await getSalonLocations()
  return <SalonLocationsClient initialLocations={locations} />
}
